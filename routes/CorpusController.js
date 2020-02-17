let express = require('express');
let CorpusService = require('../service/CorpusService');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});

router.get('/', crud.listAll(CorpusService));

router.post('/', crud.createOne(CorpusService));

router.get('/:c_id', crud.getOne(CorpusService, 'c_id'));

router.put('/:c_id', crud.updateOne(CorpusService, 'c_id'));

router.delete('/:c_id', crud.deleteOne(CorpusService, 'c_id'));

/* extra paths for easier access (put ignores req body and only changes association) */
router.get('/:c_id/annotationset',  crud.listOther(CorpusService.getAnnotationsets, 'c_id'));

router.put('/:c_id/annotationset/:s_id',  crud.setOther(CorpusService.addAnnotationset, 'c_id', 's_id'));

router.delete('/:c_id/annotationset/:s_id',  crud.unsetOther(CorpusService.removeAnnotationset, 'c_id', 's_id'));

router.get('/:c_id/document',  crud.listOther(CorpusService.getDocuments, 'c_id'));

router.put('/:c_id/document/:d_id',  crud.setOther(CorpusService.addDocument, 'c_id', 'd_id'));

router.get('/:c_id/document/count', crud.listOther(CorpusService.getDocumentCount, 'c_id'));

/* import and export of entire corpora */


router.post('/:c_id/import', (req, res, next) => {

    console.log("import");
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let uploadedFile = req.files.file; // file := input form field name
    let importPrefix = (req.body.prefix && req.body.prefix.length > 0) ? req.body.prefix : "";


    CorpusService.importZip(req.params['c_id'], uploadedFile.tempFilePath, importPrefix, uploadedFile.name )
        .then(r => {
            if (r)
                res.status(200).send(r);
            else
                res.sendStatus(404);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;
