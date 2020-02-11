let express = require('express');
let corpusController = require('../controller/corpuscontroller');
let crud = require('./crud');

let router = express.Router({mergeParams: true});

/*
 * GET /CRUD/corpus            findAll
 * POST /CRUD/corpus           createOne
 * GET /CRUD/corpus/{c_id}     getOne
 * PUT /CRUD/corpus/{c_id}     alterOne
 * DELETE /CRUD/corpus/{c_id}  deleteOne
 */

router.get('/', crud.listAll(corpusController));

router.post('/', crud.createOne(corpusController));

router.get('/:c_id', crud.getOne(corpusController, 'c_id'));

router.put('/:c_id', crud.updateOne(corpusController, 'c_id'));

router.delete('/:c_id', crud.deleteOne(corpusController, 'c_id'));

/* extra paths for easier access (put ignores req body and only changes association) */
router.get('/:c_id/annotationset',  crud.listOther(corpusController.getAnnotationsets, 'c_id'));

router.put('/:c_id/annotationset/:s_id',  crud.setOther(corpusController.addAnnotationset, 'c_id', 's_id'));

router.delete('/:c_id/annotationset/:s_id',  crud.unsetOther(corpusController.removeAnnotationset, 'c_id', 's_id'));

router.get('/:c_id/document',  crud.listOther(corpusController.getDocuments, 'c_id'));

router.put('/:c_id/document/:d_id',  crud.setOther(corpusController.addDocument, 'c_id', 'd_id'));

module.exports = router;
