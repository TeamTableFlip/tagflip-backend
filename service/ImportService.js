/** Import a tagged corpus.
 *
 * @author Christian Gawron
 *
 * This module provides functionality to import existing annotated corpora, i.e. CoNLL or GermEval data sets.
 */
const iob = require('./Import_IOB.js');
const fs = require('fs');

const IMPORTERS = [iob];

let specs = {};

IMPORTERS.forEach((imp) => {
    imp.provides.forEach((format => specs[format] = imp.create));
});

console.log('Registered importers: %o', specs);

function createImporter(format, corpus, annotationSet) {
    return new Promise((resolve, reject) => {
        if (format in specs) {
            resolve(specs[format](corpus, annotationSet));
        }
        else {
            reject('no importer for format ' + format);
        }
    });
}

module.exports = {
    createImporter
}

