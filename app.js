let config = require('./config/Config'); // process.env["NODE_CONFIG_DIR"] = __dirname + "/configDir/"; to override location from default ./config
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan'); // logging middle ware for express

/*
 * check node version to be above a certain number.
 * In our case node 12 or higher is required.
 */
let semver = require('semver');
let { engines } = require('./package');
const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  console.error(`Required node version ${version} not satisfied with current version ${process.version}.`);
  process.exit(1);
}

/* import routers */
let indexRouter = require('./routes/IndexController');
let corpusRouter = require('./routes/CorpusController');
let documentRouter = require('./routes/DocumentController');
let annotationSetRouter = require('./routes/AnnotationSetController');
let annotationRouter = require('./routes/AnnotationController');
let tagRouter = require('./routes/TagController');

// configure cors
let corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
};

let app = express();
// express middleware modules
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // configure later with GUI...

// Simulate delay
if(config.delayResponse > 0) {
  app.use((req, res, next) => {
    setTimeout(() => next(), config.delayResponse);
  });
}

// rest controller
app.use('/', indexRouter);
app.use('/corpus', corpusRouter);
app.use('/annotation', annotationRouter);
app.use('/tag', tagRouter);
app.use('/annotationset', annotationSetRouter);
app.use('/document', documentRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);

  res.sendStatus(err.status || 500);
});

module.exports = app;
