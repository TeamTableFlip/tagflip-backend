/**
 * Wrapper for node.js fs filesystem operations.
 * Necessary because node fs wants to work with callbacks and we want promises.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let path = require('path');

/**
 * check weather user has access to a file.
 * @param filepath
 * @returns {Promise<*>}
 */
function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            resolve(!error);
        });
    });
}

/**
 * reads file info.
 * @param path
 * @returns {Promise<unknown>}
 * @private
 */
function _getStats(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stats) => {
            if (err) reject(err);
            else resolve(stats);
        });
    });
}

/**
 * delete folder recursively with contents.
 * @param path
 * @returns {Promise<unknown>}
 */
function rmDir(path) {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, {recursive: true}, err => {
            if (err) reject(err);
            else resolve(!err);
        });
    });
}


/**
 * create all directory substructures for filepath
 * @param filepath
 * @returns {Promise<unknown>}
 */
function mkdirs(filepath) {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(path.dirname(filepath))) {
            resolve();
        }
        else {
            fs.mkdir(path.dirname(filepath),  {recursive: true }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        }
    });
}

/**
 * create directory for filepath
 * @param filepath
 * @returns {Promise<unknown>}
 */
function mkdir(filepath) {
    return new Promise((resolve, reject) => {
        console.log(filepath);
        if(fs.existsSync(path.dirname(filepath))) {
            resolve();
        }
        else {
            fs.mkdir(path, {recursive: true}, (err) => {
                if (err) reject(err);
                else resolve();
            });
        }
    });
}

/**
 * read file content.
 * @param filepath
 * @returns {Promise<unknown>}
 */
function readFileData(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

/**
 * save file content
 * @param filePath
 * @param data
 * @param encoding default is utf-8
 * @returns {Promise<unknown>}
 */
function saveFileData(filePath, data, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, encoding,  (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

/**
 * deletes file of link.
 * @param filePath
 * @returns {Promise<unknown>}
 */
function unlinkFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,  (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

/**
 * copies file from source to target
 * @param source
 * @param target
 * @param deleteOld if true source gets deleted
 * @returns {Promise<unknown>}
 */
function copyFile (source, target, deleteOld = false) {
    return new Promise((resolve, reject) => {
        fs.copyFile(source, target ,(err) => {
            if (err) reject(err);
            if (deleteOld)
                resolve(new Promise((resolve, reject) => {
                    fs.unlink(source,  (err) => { // delete source when done
                        if (err) reject(err);
                        else resolve(true);
                    });
                }));
            else
                resolve(true);
        });
    });
}

module.exports = {
    checkFileExists,
    mkdir,
    mkdirs,
    readFileData,
    copyFile,
    rmDir,
    unlinkFile,
    saveFileData
};
