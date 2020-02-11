let express = require('express');
let annotationController = require('../controller/annotationcontroller');
let crud = require('./crud');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(annotationController));

router.post('/', crud.createOne(annotationController));

router.get('/:a_id', crud.getOne(annotationController, 'a_id'));

router.put('/a_id', crud.updateOne(annotationController, 'a_id'));

router.delete('/:a_id', crud.deleteOne(annotationController, 'a_id'));

module.exports = router;
