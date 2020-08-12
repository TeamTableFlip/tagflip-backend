let express = require('express');
let corpusService = require('../service/CorpusService');
let documentService = require('../service/DocumentService');
let crud = require('./BaseCrudControllerFunctions');
let fileUpload = require('express-fileupload');
let config = require('../config/Config');

let router = express.Router({mergeParams: true});

router.get('/', crud.listAll(corpusService));

router.post('/', crud.createOne(corpusService));

router.get('/:c_id', crud.getOne(corpusService, 'c_id'));

router.put('/:c_id', crud.updateOne(corpusService, 'c_id'));

router.delete('/:c_id', crud.deleteOne(corpusService, 'c_id'));

/* extra paths for easier access (put ignores req body and only changes association) */
router.get('/:c_id/annotationset',  crud.listOther(corpusService.getAnnotationsets, 'c_id'));

router.put('/:c_id/annotationset/:s_id',  crud.setOther(corpusService.addAnnotationset, 'c_id', 's_id'));

router.delete('/:c_id/annotationset/:s_id',  crud.unsetOther(corpusService.removeAnnotationset, 'c_id', 's_id'));

router.get('/:c_id/document',  crud.listOther(documentService.listAllByCorpusId, 'c_id'));

router.put('/:c_id/document/:d_id',  crud.setOther(corpusService.addDocument, 'c_id', 'd_id'));

router.get('/:c_id/document/count', crud.listOther(corpusService.getDocumentCount, 'c_id'));

/* import of entire corpora */
router.post('/:c_id/document/import', fileUpload({
    createParentPath: true,
    debug: true,
    useTempFiles : true,
    tempFileDir : config.files.temp
}), crud.importWrapper(corpusService.importFiles, 'c_id'));

module.exports = router;
