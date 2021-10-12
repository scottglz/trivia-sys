import { CachingStorage, PgStorage } from '@trivia-nx/triv-storage';

const pgOptions = {
   user: 'trivacct@trivia-postgres-11',
   host: 'trivia-postgres-11.postgres.database.azure.com',
   database: 'postgres',
   password: process.env.POSTGRES_PASSWORD
};

export const environment = {
   production: true,
   pgOptions: pgOptions,
   storage: new CachingStorage(new PgStorage(pgOptions)),
   port: process.env.PORT || 3333,
   slackChannel: process.env.SLACKHOOK_URL,
   mailgun: {
      apiKey: process.env.MAILGUN_APIKEY,
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>'
};
