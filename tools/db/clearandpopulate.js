'use strict';

module.exports = async function() {
   await require('./dropschema')();
   await require('./createschema')();
   await require('./addtestdata')();
};

require('./mayberunscript')(module);