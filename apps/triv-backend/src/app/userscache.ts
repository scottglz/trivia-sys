let cache = null;

export function makeUsersCache(storage) {

   async function getUsers() {
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

      userById: async function(id: number) {
         const users = await getUsers();
         return users.find(user => user.userid === id);
      },

      userByEmail: async function(email: string) {
         const users = await getUsers();
         return users.find(user => user.email.toUpperCase() === email.toUpperCase());
      }

   };
}


