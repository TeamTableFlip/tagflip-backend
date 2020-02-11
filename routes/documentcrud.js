let express = require('express');
let documentCotroller = require('../controller/documentcontroller');
let crud = require('./crud');

let router = express.Router({mergeParams: true});

/*
 * GET /CRUD/corpus            findAll
 * POST /CRUD/corpus           createOne
 * GET /CRUD/corpus/{c_id}     getOne
 * PUT /CRUD/corpus/{c_id}     alterOne
 * DELETE /CRUD/corpus/{c_id}  deleteOne
 */

router.get('/', crud.listAll(documentCotroller));

router.post('/', crud.createOne(documentCotroller));

router.get('/:d_id', crud.getOne(documentCotroller, 'd_id'));

router.put('/:d_id', crud.updateOne(documentCotroller, 'd_id'));

router.delete('/:d_id', crud.deleteOne(documentCotroller, 'd_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:d_id/tag', crud.listOther(documentCotroller.getTags, 'd_id'));


module.exports = router;
