let express = require('express');
let annotationSetController = require('../controller/annotationsetcontroller');
let crud = require('./crud');

let router = express.Router({mergeParams: true});


router.get('/', crud.listAll(annotationSetController));

router.post('/', crud.createOne(annotationSetController));

router.get('/:s_id', crud.getOne(annotationSetController, 's_id'));

router.put('/:s_id', crud.updateOne(annotationSetController, 's_id'));

router.delete('/:s_id', crud.deleteOne(annotationSetController, 's_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:s_id/corpus',  crud.listOther(annotationSetController.getCorpora, 's_id' ));

router.put('/:s_id/corpus/:c_id',  crud.setOther(annotationSetController.addCorpus, 's_id', 'c_id'));

router.delete('/:s_id/corpus/:c_id',  crud.unsetOther(annotationSetController.removeCorpus, 's_id', 'c_id'));

router.get('/:s_id/annotation',  crud.listOther(annotationSetController.getAnnotations, 's_id'));

module.exports = router;
