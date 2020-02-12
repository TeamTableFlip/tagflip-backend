let express = require('express');
let tagController = require('../controller/tagcontroller');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(tagController));

router.post('/', crud.createOne(tagController));

router.get('/:t_id', crud.getOne(tagController, 't_id'));

router.put('/:t_id', crud.updateOne(tagController, 't_id'));

router.delete('/t:_id', crud.deleteOne(tagController, 't_id'));

module.exports = router;
