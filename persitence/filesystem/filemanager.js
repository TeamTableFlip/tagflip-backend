/**
 * Some simple filesystem system operations.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let path = require('path');
let config = require('../../config/config');


function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            resolve(!error);
        });
    });
}


async function readFile(fileName) {
    fileName = path.join(config.files.prefix, fileName);
    console.info("reading file: " + fileName);
    if (await checkFileExists(fileName)) {
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            return data;
        });
    } else {
        throw Error("file not found");
    }
}

async function saveFile(fileName, override = false, data) {
    fileName = path.join(config.files.prefix, fileName);
    await fs.mkdir(fileName,  {recursive: true }, (err) => {throw Error("can not create target folder")});
    console.info("saving file: " + fileName);
    if (!override && (await checkFileExists(fileName))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    fs.writeFile(fileName, data, encoding,  (err) => {
        if (err) throw err;
        return true;
    });
}

async function deleteFile(fileName) {
    fileName = path.join(config.files.prefix, fileName);
    console.info("deleting file: " + fileName);
    if (!(await checkFileExists(fileName))) {
        throw Error ("file does not exist");
    }
    fs.unlink(fileName,  (err) => {
        if (err) throw err;
        return true;
    });
}

async function moveFile(fileNameSource, fileNameTarget, override = false) {
    fileNameSource = path.join(config.files.prefix, fileNameSource);
    fileNameTarget = path.join(config.files.prefix, fileNameTarget);
    await fs.mkdir(fileNameTarget,  {recursive: true }, (err) => {throw Error("can not create target folder")});
    console.info("moving file from " + fileNameSource + " to "+ fileNameTarget);
    if (!(await checkFileExists(fileNameSource))) {
        throw Error ("source does not exist");
    }
    if (!override && await checkFileExists(fileNameTarget)) {
        throw Error ("target file does already exist");
    }
    fs.copyFile(fileNameSource, fileNameTarget ,(err) => {
        if (err) throw err;
        fs.unlink(fileNameSource,  (err) => { // delete source when done
            if (err) throw err;
            return true;
        });
    });
}

module.exports = {
    readFile,
    saveFile,
    deleteFile,
    moveFile
};
