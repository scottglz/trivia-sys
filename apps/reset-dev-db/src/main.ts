import { environment } from './environments/environment';
import dropSchema from './app/dropschema';
import createSchema from './app/createschema';
import addTestData from './app/addTestData';
import { PgStorage } from '@trivia-nx/triv-storage';

const storage = environment.storage;

async function go(storage: PgStorage) {
   await dropSchema(storage);
   await createSchema(storage);
   await addTestData(storage);
}

go(storage)
   .then(() => process.exit(0))
   .catch((err) => {
      console.log(err);
      process.exit(-1);
   });
