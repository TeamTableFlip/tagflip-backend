let express = require('express');
let fileUpload = require('express-fileupload');
let ImportService = require('../service/ImportService');
let config = require('../config/Config');
const fs = require('fs');

let router = express.Router({ mergeParams: true });

/* import of entire corpora */
router.post('/',
    fileUpload({
        createParentPath: true,
        debug: true,
        useTempFiles: true,
        tempFileDir: config.files.temp
    }),
    (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let name = req.body.name;
        let annotationSet = req.body.annotationSet;
        let file = req.files.file; // file := input form field name
        ImportService.createImporter("NoSta-D", name, annotationSet)
            .then(async (importer) => {
                console.log('importer is %o', importer);
                return importer.import(fs.createReadStream(file.tempFilePath));
            })
            .then(() => {
                res.status(204).send("success");
            })
            .catch((err) => res.status(500).send({ status: "failure", error: err }));
    });


module.exports = router;