import { userFull } from "@trivia-nx/users";
import { TriviaStorage } from "./storage/triviastorage";

let cache = null;

export function makeUsersCache(storage: TriviaStorage ) {

   async function getUsers(): Promise<userFull[]> {
      if (!cache) {
         const users = await storage.getUsers();
         cache = users;
      }

      return cache;  
   }
   
   return {
      getUsers: getUsers,

      invalidate() {
         cache = null;
      },

      userById: async function(id: number): Promise<userFull|undefined> {
         const users = await getUsers();
         return users.find(user => user.userid === id);
      },

      userByEmail: async function(email: string): Promise<userFull|undefined> {
         const users = await getUsers();
         return users.find(user => user.email.toUpperCase() === email.toUpperCase());
      }

   };
}


