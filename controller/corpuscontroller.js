let {corpus} = require('../persitence/sql/corpus');
let {connection} = require('../persitence/sql/sequelize');


function listCorpora() {
    return new Promise((resolve, reject) => {
        connection.sync().then(() => {
            corpus.findAll().then( (corpus) => {
                resolve(corpus);
            }).catch(()=>reject([]))
        }).catch(()=>reject([]))
    })
}
// connection.sync().then(
//     corpus.findAll().then(
//
//     ).catch()
// ).catch()


module.exports = {
    listCorpora
};
