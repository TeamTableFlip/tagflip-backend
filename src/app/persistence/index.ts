import { Sequelize } from 'sequelize-typescript';

import config from '../Config'
import * as path from "path";

const sequelize = new Sequelize({
        repositoryMode: true,
        database: config.db.name,
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        username: config.db.user,
        password: config.db.password
});

console.log("Adding models from path: " + path.join(__dirname, 'model'))
sequelize.addModels([path.join(__dirname, 'model')])


export default sequelize;

