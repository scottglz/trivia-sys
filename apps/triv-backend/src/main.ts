import { environment as config } from './environments/environment';
import router from './app/restrouter';
import authrouter from './app/authrouter';
import * as express from 'express';
import { Server }  from 'http';
import RestError from './app/resterror';
import * as nocache from 'nocache';

const app = express();
const http = new Server(app);

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


