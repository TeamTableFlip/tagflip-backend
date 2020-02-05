let ld = require('lodash');
let fs = require('fs');
let defaultConfig = require('./default.json');
let environment = process.env.NODE_ENV || 'development';
let environmentConfig = require('./' + environment + '.json');
let config = ld.merge(defaultConfig, environmentConfig);

console.info("TODO: parsing system environment configuration");
//TODO add support for Configuration via system environment aka command line arguments
// so something like this: config.port = process.env.port || config.port;

try {
    console.info("searching for local configs");
    if (fs.existsSync(__dirname + '/config.js')) {
        console.info("local config found, merging configs (overwriting env vars!)");
        let localConfig = require('./local');
        config = ld.merge(config, localConfig);
    } else {
      console.info("no local config found, using environment config variables only");
    }
} catch(err) {
    console.error(err);
    console.warn("error on looking for local config, using environment variables only");
}
module.exports = config;
