let express = require('express');
let documentCotroller = require('../controller/documentcontroller');
let crud = require('./BaseCrudControllerFunctions');

let router = express.Router({mergeParams: true});

router.get('/', crud.listAll(documentCotroller));

router.post('/', crud.createOne(documentCotroller));

router.get('/:d_id', crud.getOne(documentCotroller, 'd_id'));

router.put('/:d_id', crud.updateOne(documentCotroller, 'd_id'));

router.delete('/:d_id', crud.deleteOne(documentCotroller, 'd_id'));

/* extra paths for easier access (put ignores req body and only changes association) */

router.get('/:d_id/tag', crud.listOther(documentCotroller.getTags, 'd_id'));


module.exports = router;
