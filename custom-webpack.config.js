const path = require('path');
module.exports = {
    resolve: {
      // Solves "npm link" missing dependencies error using the connectivity SDK during development (missing web3-core, etc).
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    }
  };