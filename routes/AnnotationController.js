let express = require('express');
let AnnotationService = require('../service/AnnotationService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(AnnotationService));

router.post('/', crud.createOne(AnnotationService));

router.get('/:a_id', crud.getOne(AnnotationService, 'a_id'));

router.put('/:a_id', crud.updateOne(AnnotationService, 'a_id'));

router.delete('/:a_id', crud.deleteOne(AnnotationService, 'a_id'));

module.exports = router;
