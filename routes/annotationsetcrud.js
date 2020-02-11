let express = require('express');
let annotationSetController = require('../controller/annotationsetcontroller');
let crud = require('./crud');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(annotationSetController));

router.post('/', crud.createOne(annotationSetController));

router.get('/:s_id', crud.getOne(annotationSetController, 's_id'));

router.put('/:s_id', crud.updateOne(annotationSetController, 's_id'));

router.delete('/:s_id', crud.deleteOne(annotationSetController, 's_id'));

module.exports = router;
