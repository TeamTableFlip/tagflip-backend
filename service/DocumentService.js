/**
 * because we also have to read text data from filesystem. This class requires more logic than the other services...
 * All Functions read and write data from and to the database as well as the file storage.
 * They try and keep them in sync with each other, by rolling back changes in case of errors.
 *
 * TODO: create some kind of timed cleanup procedure that runs over night and makes sure everything is as it's supposed to.
 */
let {SystemError, UserError} = require('./Exceptions');
let {documentModel, corpusModel} = require('../persistence/sql/Models');
let hashing = require('../persistence/Hashing');

async function listAll() {
    let documents = await documentModel.findAll();
    return documents;
}

async function listAllByCorpusId(c_id) {
    let documents = await documentModel.findAll({
        where: {
            c_id: c_id,
        }, attributes: {
            exclude: ["content"]
        }
    });
    return documents;
}

async function get(id) {
    let doc = await documentModel.findByPk(id);
    return doc;
}

async function create(item) {
    if (item.id)
        item.id = undefined;
    if (!item.content)
        throw new UserError("no text specified");

    if (item.filename === undefined || item.filename === null ||
        (typeof item.filename !== "string")) {
        throw new UserError("specified filename missing, filename is " + String(item.filename));
    }

    let hash = hashing.sha256Hash(item.content);
    let document = findOneByCorpusIdAndHash(item.c_id, hash);

    let doc;
    let created = false;
    if (!document || document.c_id !== item.c_id) {
        [doc, created] = await documentModel.findOrCreate({
            where: {
                c_id: item.c_id,
                filename: item.filename,
                document_hash: hash,
                content: item.content
            }
        });
    }
    return doc;
}

async function del(id) {
    let doc = await documentModel.findByPk(id);
    await documentModel.destroy({where: {d_id: id}});
    return id;
}

/**
 * Delete all Documents of the given Corpus, by creating a single DELETE-Transaction and then removing all files from
 * the disc.
 * @param corpus The Corpus to delete the Documents from.
 * @returns {Promise<void>}
 */
async function deleteMany(corpus) {
    await documentModel.destroy({where: {c_id: corpus.c_id}});
}

async function update(id, item) {
    if (item.id) {
        if (item.id !== id) {
            console.warn("request for item update has different ids, setting id to url param");
            item.id = id;
        }
    }
    let old_doc = await documentModel.findByPk(id);
    let updatesArray = await documentModel.update(item, {where: {d_id: id}});
    // TODO do something with return value (seems to be somewhat ambiguous)
    let new_doc = await documentModel.findByPk(id);
    return new_doc;
}

async function getTags(d_id) {
    let doc = await documentModel.findByPk(d_id);
    return doc.getTags();
}

async function findOneByCorpusIdAndHash(c_id, hash) {
    let document = await documentModel.findOne({where: {c_id: c_id, document_hash: hash}});
    return document;
}

module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    deleteMany: deleteMany,
    createOne: create,
    getTags,
    findOneByCorpusIdAndHash,
    listAllByCorpusId
};
