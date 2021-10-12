'use strict';

module.exports = function(module2) {
   if (!module2.parent) {
      module2.exports()
      .then(() => process.exit(0))
      .catch((err) => {
         console.log(err);
         process.exit(-1);
      });
   }
}