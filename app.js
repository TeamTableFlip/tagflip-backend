
let config = require('./config/config'); // process.env["NODE_CONFIG_DIR"] = __dirname + "/configDir/"; to override location from default ./config
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan'); // logging middle ware for express, TODO configure log rotation

let indexRouter = require('./routes/IndexController');
let testRouter = require('./routes/test');
let corpusRouter = require('./routes/corpuscrud');
let documentRouter = require('./routes/DocumentController');
let annotationSetRouter = require('./routes/annotationsetcrud');
let annotationRouter = require('./routes/annotationcrud');
let tagRouter = require('./routes/TagController');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // configure later with GUI...

app.use('/', indexRouter);
app.use('/corpus', corpusRouter);
app.use('/annotation', annotationRouter);
app.use('/tag', tagRouter);
app.use('/annotationset', annotationSetRouter);
app.use('/document', documentRouter);
app.use('/test', testRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.sendStatus(err.status || 500)
});

module.exports = app;
