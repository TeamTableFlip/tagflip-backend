let express = require('express');
let corpusController = require('../controller/corpuscontroller');

let router = express.Router({mergeParams: true});

/*
 * GET /CRUD/corpus            findAll
 * POST /CRUD/corpus           createOne
 * GET /CRUD/corpus/{c_id}     getOne
 * PUT /CRUD/corpus/{c_id}     alterOne
 * DELETE /CRUD/corpus/{c_id}  deleteOne
 */

router.get('/', (req, res, next) => {
    corpusController.listAll().then((items)=> {
        res.send(items);
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

router.post('/', (req, res, next) => {
    console.info("creating new corpus:");
    corpusController.createOne(req.body).then((newItem)=> {
        res.status(200).send(newItem);
    }).catch((err)=>{
        console.error(err);
        res.status(500).send(err);
    });
});

router.get('/:c_id', (req, res, next) => {
    console.info("get corpus with id: " + req.params.c_id);
    corpusController.getOne(req.params.c_id).then((item)=> {
        if (item == null) {
            res.sendStatus(404);
        } else {
            res.status(200).send(item);
        }
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

router.put('/:c_id', (req, res, next) => {
    console.info("updating corpus with id: " + req.params.c_id);
    corpusController.updateOne(req.params.c_id, req.body).then((updatedItem)=> {
        if (updatedItem) {
            res.status(200).send(updatedItem);
        } else {
            res.sendStatus(404);
        }
    }).catch((err)=>{
        res.status(500).send(err);
    });
});


router.delete('/:c_id', (req, res, next) => {
    console.info("deleting corpus with id: " + req.params.c_id);
    corpusController.deleteOne(req.params.c_id).then((deleted)=> {
        if (deleted) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500); // TODO better responses....
        }
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

module.exports = router;
