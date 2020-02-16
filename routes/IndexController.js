let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to TagFlip!');
});

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.status(200).send({status: "available"});
});

module.exports = router;
