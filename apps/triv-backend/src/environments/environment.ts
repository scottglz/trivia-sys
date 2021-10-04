import PgStorage from '../app/storage/pgstorage';

const pgOptions = {
  user: 'postgres',
  host: process.env.IS_DOCKER ? 'host.docker.internal' : 'localhost',
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD
};

export const environment = {
  production: false,
  pgOptions: pgOptions,
   storage: new PgStorage(pgOptions),
   port: process.env.PORT || 3333,
   slackChannel: process.env.SLACKHOOK_URL,
   mailgun: {
      apiKey: process.env.MAILGUN_APIKEY,
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>'
};


