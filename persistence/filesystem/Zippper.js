let fs = require('fs');
let fileUtils = require('./FileUtils');
let config = require('../../config/Config');
let path = require('path');
let unzipper = require("unzipper");

/**
 * extracts a zip and puts its content here: config.files.unzipBuffer.
 * Existing files will be overwritten.
 * returns a list of filePaths (= zip contents).
 *
 * @param zipFilePath
 * @returns {Promise<err | {parentFolder: String, files : []}>}
 */
async function extractZip(zipFilePath) {
    /* overwrites contents anyway, so this is not important for now */
    // console.debug("cleanup previous import");
    // await fileUtils.rmDir(config.files.unzipBuffer);
    let zipName = path.basename(zipFilePath);
    let extractPath = path.join(config.files.unzipBuffer, zipName);
    await fileUtils.mkdir(extractPath);
    console.log("start extract new zip");

    let filesPaths = [];

    function _writerHack(opts) {
        if (opts.path) {
            filesPaths.push(opts.path);
        }
        return require('fstream').Writer(opts);
    }

    return new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({path: extractPath, getWriter: _writerHack})) // getWriter is undocumented! hmm...
            .on('error', (err) => {
                // TODO cleanup of already imported data? maybe try rescue what was successful?
                reject(err);
            }).on('close', (err) => {
            resolve({"parentFolder": extractPath, "files": filesPaths});
        });
    });
}

module.exports = {
    extractZip
};
