let express = require('express');
let AnnotationSetService = require('../service/AnnotationSetService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(AnnotationSetService));

router.post('/', crud.createOne(AnnotationSetService));

router.get('/:s_id', crud.getOne(AnnotationSetService, 's_id'));

router.put('/:s_id', crud.updateOne(AnnotationSetService, 's_id'));

router.delete('/:s_id', crud.deleteOne(AnnotationSetService, 's_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:s_id/corpus',  crud.listOther(AnnotationSetService.getCorpora, 's_id' ));

router.put('/:s_id/corpus/:c_id',  crud.setOther(AnnotationSetService.addCorpus, 's_id', 'c_id'));

router.delete('/:s_id/corpus/:c_id',  crud.unsetOther(AnnotationSetService.removeCorpus, 's_id', 'c_id'));

router.get('/:s_id/annotation',  crud.listOther(AnnotationSetService.getAnnotations, 's_id'));

module.exports = router;
