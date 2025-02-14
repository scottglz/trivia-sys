import { CachingStorage, PgStorage } from '@trivia-nx/triv-storage';

const pgOptions = {
   user: 'trivacct',
   host: 'trivia-postgres-11.postgres.database.azure.com',
   database: 'postgres',
   password: process.env.NX_POSTGRES_PASSWORD
};

export const environment = {
   production: true,
   pgOptions: pgOptions,
   storage: new CachingStorage(new PgStorage(pgOptions)),
   port: process.env.PORT || 3333,
   mailgun: {
      apiKey: process.env.NX_MAILGUN_APIKEY,
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>',
   MAILGUN_APIKEY: process.env.NX_MAILGUN_APIKEY,
   POSTGRES_PASSWORD: process.env.NX_POSTGRES_PASSWORD,
   SLACK_OATH_SECRET: process.env.NX_SLACK_OATH_SECRET,
   JWT_SECRET: process.env.NX_JWT_SECRET,
   SLACKHOOK_URL: process.env.NX_SLACKHOOK_URL
};
