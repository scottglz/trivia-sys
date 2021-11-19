import { environment as config } from './environments/environment';
import router from './app/restrouter';
import authrouter from './app/authrouter';
import * as express from 'express';
import { Server }  from 'http';
import * as socketio from 'socket.io';
import RestError from './app/resterror';
import shareSocketIo from './app/sharesocketio';
import * as nocache from 'nocache';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

const app = express();
const http = new Server(app);
const io = new socketio.Server(http);

shareSocketIo.io = io;

app.use(nocache());

app.use(authrouter);
app.use('/trivia', router);

app.use(function (req, res) {
   res.status(404).send({status: 404, message: 'NOT_FOUND'});
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err, req, res, next) {
   if (err instanceof RestError) {
      res.status(err.status).send({status: err.status, message: err.message});
   }
   else {
      res.status(500).send({status: 500, message: '' + err});
   }
});

const server = http.listen(config.port, function() {
   console.log('Server running on port ' + config.port);
});

server.on('error', console.error);

const JWT_COOKIE = 'djywhxk';


interface mySocket extends socketio.Socket {
   userid: number
}

io.use((socket: mySocket, next) => {
   const cookieHeader = socket.handshake?.headers?.cookie;
   if (cookieHeader) {
      const cookieVals = cookie.parse(cookieHeader);
      const jwtCookie = cookieVals[JWT_COOKIE];
      if (jwtCookie) {
         jwt.verify(jwtCookie, config.JWT_SECRET, function(err, payload) {
            if (err) {
               // ?
            }
            else {
               const userid = payload.userid;
               console.log(`Socket connection authenticated with userid ${userid}`);
               socket.userid = userid;
            }
            next();
         });
      }
   }
});

