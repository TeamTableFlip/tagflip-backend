let express = require('express');
let documentService = require('../service/DocumentService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});

router.get('/', crud.listAll(documentService));

router.post('/', crud.createOne(documentService));

router.get('/:d_id', crud.getOne(documentService, 'd_id'));

router.put('/:d_id', crud.updateOne(documentService, 'd_id'));

router.delete('/:d_id', crud.deleteOne(documentService, 'd_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:d_id/tag', crud.listOther(documentService.getTags, 'd_id'));


module.exports = router;
