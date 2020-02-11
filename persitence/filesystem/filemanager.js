/**
 * Some simple filesystem system operations.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');

function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            resolve(!error);
        });
    });
}

async function readFile(fileName) {
    if (await checkFileExists(fileName)) {
        return  new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    } else {
        throw Error("file not found");
    }
}

async function saveFile(fileName, override, data) {
    if (!override && (await checkFileExists(fileName))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, encoding,  (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

async function deleteFile(fileName) {
    if (!(await checkFileExists(fileName))) {
        throw Error ("file does not exist");
    }
    return new Promise((resolve, reject) => {
        fs.unlink(fileName,  (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}


module.exports = {
    readFile,
    saveFile,
    deleteFile
};
