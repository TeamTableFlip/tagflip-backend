let express = require('express');
let DocumentService = require('../service/DocumentService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});

router.get('/', crud.listAll(DocumentService));

router.post('/', crud.createOne(DocumentService));

router.get('/:d_id', crud.getOne(DocumentService, 'd_id'));

router.put('/:d_id', crud.updateOne(DocumentService, 'd_id'));

router.delete('/:d_id', crud.deleteOne(DocumentService, 'd_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:d_id/tag', crud.listOther(DocumentService.getTags, 'd_id'));


module.exports = router;
