import {  PgStorage } from '@trivia-nx/triv-storage';

const pgOptions = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.NX_DEV_POSTGRES_PASSWORD
};

export const environment = {
  production: false,
  pgOptions: pgOptions,
  storage: new PgStorage(pgOptions)
};