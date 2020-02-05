import express from 'express';

let router = express.Router();
/**
 * A test route to check the connectivity. Returns status 200 - OK.
 */
router.get('/test', (req, res, next) => {
    res.status(200).send({status: 200});
});

module.exports = router;
