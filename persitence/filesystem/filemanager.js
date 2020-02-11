/**
 * Some simple filesystem system operations.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let path = require('path');
let config = require('../../config/config');


function _checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            resolve(!error);
        });
    });
}

function _mkdirs(filepath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.dirname(filepath),  {recursive: true }, (err) => {
            if (err) reject(err)
            else resolve();
        });
    });
}


function _readFileData(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

function _saveFileData(filePath, data, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, encoding,  (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

function _unlinkFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,  (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

function _copyFile (source, target) {
    return new Promise((resolve, reject) => {
        fs.copyFile(source, target ,(err) => {
            if (err) reject(err);
            resolve(new Promise((resolve, reject) => {
                fs.unlink(source,  (err) => { // delete source when done
                    if (err) reject(err);
                    resolve(true);
                });
            }));
        });
    });

}
async function readFile(fileName) {
    fileName = path.join(config.files.prefix, fileName);
    console.info("reading file: " + fileName);
    if (await _checkFileExists(fileName)) {
        return (await _readFileData(fileName)).toString();
    } else {
        throw Error("file not found");
    }
}

async function saveFile(fileName, override = false, data) {
    console.info("saving file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    await _mkdirs(fileName);
    if (!override && (await _checkFileExists(fileName))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    return await _saveFileData(fileName, data);
}

async function deleteFile(fileName) {
    console.info("deleting file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    if (!(await _checkFileExists(fileName))) {
        throw Error ("file does not exist");
    }
    _unlinkFile(fileName);
}

async function moveFile(fileNameSource, fileNameTarget, override = false) {
    console.info("moving file from " + fileNameSource + " to "+ fileNameTarget);
    fileNameSource = path.join(config.files.prefix, fileNameSource);
    fileNameTarget = path.join(config.files.prefix, fileNameTarget);
    await _mkdirs(fileNameTarget);
    if (!(await _checkFileExists(fileNameSource))) {
        throw Error ("source does not exist");
    }
    if (!override && await _checkFileExists(fileNameTarget)) {
        throw Error ("target file does already exist");
    }
    return await _copyFile(fileNameSource, fileNameTarget);
}

module.exports = {
    readFile,
    saveFile,
    deleteFile,
    moveFile
};
