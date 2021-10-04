import { json, Response } from 'express';
import routerMaker from 'express-promise-router';
import axios from 'axios';
import { environment as config } from '../environments/environment';
import { makeUsersCache } from './userscache';
import * as jwt from 'jsonwebtoken';
import * as days from '@trivia-nx/days';
import RestError from './resterror';
import * as loginTokens from './logintokens';
import * as Mailgun  from 'mailgun-js';
import { userFull } from '@trivia-nx/users';
import * as cookieParser from 'cookie-parser';
import * as querystring from 'querystring';

const JWT_SECRET = process.env.JWT_SECRET;

const router = routerMaker();
const storage = config.storage;
const usersCache = makeUsersCache(storage);
const mailgun = new Mailgun(config.mailgun);

function afterUserAuthenticated(userid: number, res: Response) {
   const webTokenPayload = {
      userid: userid
   };
   const webToken = jwt.sign(webTokenPayload, JWT_SECRET, {expiresIn: '365d'});
   res.cookie(JWT_COOKIE, webToken, {httpOnly: true, sameSite: true, maxAge: 1000*60*60*24*30});
   res.redirect('/');
}

function verifyJwt(webTokenEncoded: string, secret: string) {
   return new Promise<jwt.JwtPayload>(function(resolve, reject) {
      jwt.verify(webTokenEncoded, secret, async function(err, decoded) {
         if (err) {
            reject(new RestError(401, 'Bad or Expired Web Token'));
         }
         else {
            resolve(decoded);
         }
      });
   });
}

router.use(json());


declare module 'express-serve-static-core' {
   interface Request {
       user?: userFull
   }
}

router.use(cookieParser());

const JWT_COOKIE = 'djywhxk';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use(async function(req, _res) {
   const jwtCookieVal = req.cookies[JWT_COOKIE];
   if (jwtCookieVal) {
      const jwt = await verifyJwt(jwtCookieVal, JWT_SECRET);
      const userid = jwt.userid;
      const user = await usersCache.userById(userid);
      if (!user) {
         console.log('unknown user');
         console.log(JSON.stringify(await usersCache.getUsers()));
         throw new RestError(401, 'Unknown User');
      }
      req.user = user;
   }
   return Promise.resolve('next');
});

router.post('/auth/logout', async function(req, res) {
   res.clearCookie(JWT_COOKIE);
   res.json(true);
});

router.post('/auth/requestemailsignin', async function(request, response) {
   const email = request.body.email.trim();
   if (!email) {
      throw new RestError(400, 'Invalid email address');
   }

   const user = await usersCache.userByEmail(email);

   if (!user) {
      throw new RestError(400, `There is no user with the email address "${email}".`);
   }

   const token = loginTokens.generateToken(user.userid);
   const baseUrl = 'https://' + request.get('host');

   const data = {
      from: config.mailFrom,
      to: email,
      subject: 'Trivia Login Magic Link',
      html: 
`
<p>
<a href="${baseUrl}/auth/magiclink/${token}">Click here</a> to sign into the Trivia Server.
This link is only valid for five minutes from when this message was sent.
</p> 
`      
   };
   await new Promise<void>((resolve, reject) => {
      mailgun.messages().send(data, function (error: unknown) {
         if (error) {
            reject(error);
         }
         else {
            resolve();
         }
      });
   });

   response.json({ok: true});
});



router.get('/auth/magiclink/:token([0-9a-fA-F]+)', async function(request, response) {
   const token = request.params.token;
   const tokenRecord = loginTokens.checkToken(token);
   if (tokenRecord) {
       // Get our userid from that slack info, like slackresponse.user.email
       const userid = tokenRecord.userid;
       const user = await usersCache.userById(userid);
       if (user) {
          afterUserAuthenticated(user.userid, response);
          return;       
       }
   }

   response.render('page.html', {
      message: 'Sorry, your magic link is either expired, already used, or invalid.'
   });
});

router.get('/auth/slackredirect', async function(request, response) {
   const params = request.query;
   if (params.error) {
      throw new Error('Error from Slack: ' + params.error);
   }

   const code = params.code as string;
   const baseUrl = params.state;
   const redirect_uri = baseUrl + '/auth/slackredirect';

   if (code) {
      const slackresponse = await axios.get('https://slack.com/api/oauth.access?' +
         querystring.stringify({
            client_id: '456894231392.459012826326',
            client_secret: process.env.SLACK_OATH_SECRET,
            code: code,
            redirect_uri: redirect_uri
         })
      );

      let slackUser = slackresponse.data.user;
      if (!slackUser) {
         const accessToken = slackresponse.data.access_token;
         if (!accessToken) {
            throw new Error('No User and No Access Token: ' + JSON.stringify(slackresponse));
         }
         const nextResponse = await axios.get('https://slack.com/api/users.identity?token=' + accessToken);
         slackUser = nextResponse.data.user;
         if (!slackUser) {
            throw new Error('STILL no slackUser?');
         }
      }
      
      // Get our userid from that slack info, like slackresponse.user.email
      const email = slackUser.email;
      let user = await usersCache.userByEmail(email);
      if (!user) {
         user = await storage.createUser(slackUser.name, slackUser.email, days.dateToDayString(new Date()));
         usersCache.invalidate();
      }
      afterUserAuthenticated(user.userid, response);
   }
   else {
      response.render('page.html', {
         message: 'Something went wrong, sorry. :-/'
      });
   }
});

export default router;