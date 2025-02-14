import { CachingStorage, PgStorage } from '@trivia-nx/triv-storage';

const pgOptions = {
  user: 'postgres',
  host: process.env.IS_DOCKER ? 'host.docker.internal' : 'localhost',
  database: 'postgres',
  password: process.env.NX_DEV_POSTGRES_PASSWORD
};

export const environment = {
   production: false,
   pgOptions: pgOptions,
   storage: new CachingStorage(new PgStorage(pgOptions)),
   port: process.env.PORT || 3333,
   mailgun: {
      apiKey: process.env.NX_DEV_MAILGUN_APIKEY,
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>',
   MAILGUN_APIKEY: process.env.NX_DEV_MAILGUN_APIKEY,
   POSTGRES_PASSWORD: process.env.NX_DEV_POSTGRES_PASSWORD,
   SLACK_OATH_SECRET: process.env.NX_DEV_SLACK_OATH_SECRET,
   JWT_SECRET: process.env.NX_DEV_JWT_SECRET,
   SLACKHOOK_URL: process.env.NX_DEV_SLACKHOOK_URL
};


