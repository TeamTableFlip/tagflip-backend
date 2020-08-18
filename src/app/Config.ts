import * as ld from 'lodash';
import * as fs from 'fs';
import * as path from "path";

const config_folder = path.join(path.resolve(__dirname,"..","..","config"));

let defaultConfig = require(path.join(config_folder, 'default.json'));
let environment = process.env.NODE_ENV || 'development';
console.info("environment: %s", environment)
let environmentConfig = require(path.join(config_folder, environment + '.json'));
let config = ld.merge(defaultConfig, environmentConfig);

console.info("TODO: parsing system environment configuration");
//TODO add support for Configuration via system environment aka command line arguments
// so something like this: config.port = process.env.port || config.port;

try {
    console.info("searching for local configs");
    if (fs.existsSync(path.join(config_folder, 'local.json'))) {
        console.info("local config found, merging configs (overwriting env vars!)");
        let localConfig = require(path.join(config_folder, 'local.json'));
        config = ld.merge(config, localConfig);
    } else {
        console.info("no local config found, using environment config variables only");
    }
} catch (err) {
    console.error(err);
    console.warn("error on looking for local config, using environment variables only");
}

console.debug(`using config: ${JSON.stringify(config)}`);


export default config;
