let express = require('express');
let TagService = require('../service/TagService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(TagService));

router.post('/', crud.createOne(TagService));

router.get('/:t_id', crud.getOne(TagService, 't_id'));

router.put('/:t_id', crud.updateOne(TagService, 't_id'));

router.delete('/:t_id', crud.deleteOne(TagService, 't_id'));

module.exports = router;
