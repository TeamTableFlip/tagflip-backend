import * as express from "express";
import {NextFunction} from "express";
import * as cors from 'cors';
import {CorsOptions} from 'cors';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as path from "path";

import {Server} from "typescript-rest";
import config from './app/Config'
import {TestController} from "./app/controllers/TestController";
import {CorpusController} from "./app/controllers/CorpusController";
import {AnnotationSetController} from "./app/controllers/AnnotationSetController";
import {AnnotationController} from "./app/controllers/AnnotationController";
import {HttpError} from "typescript-rest/dist/server/model/errors";
import {DocumentController} from "./app/controllers/DocumentController";
import {TagController} from "./app/controllers/TagController";
import {CorpusImportController} from './app/controllers/CorpusImportController';

// configure cors
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`))
        }
    },
    credentials: true
};

const errorMiddleware = (error: HttpError, request: express.Request, response: express.Response, next: NextFunction) => {
    let message = error.message;
    let statusCode = error.statusCode || 500;
    console.error(error);
    response.status(statusCode).send(Object.assign({}, error, { message }))
}

class TagFlipServer {

    private readonly app!: express.Application;

    constructor() {
        this.app = express();
    }

    public run() {
        this.app.use(cors(corsOptions));
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public'))); // configure later with GUI...

        // Simulate delay
        if (config.delayResponse > 0) {
            this.app.use((req, res, next) => {
                setTimeout(() => next(), config.delayResponse);
            });
        }

        Server.buildServices(this.app,
            TestController, CorpusController, DocumentController, CorpusImportController,
            AnnotationSetController, AnnotationController, TagController);
        this.app.listen(config.serverPort, function () {
            console.log('Server listening on port ' + config.serverPort + '!');
        });

        // error handler
        this.app.use(errorMiddleware);
    }

}

new TagFlipServer().run()


