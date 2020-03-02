
let fs = require('fs');
let path = require('path');

function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            resolve(!error);
        });
    });
}

function _getStats(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stats) => {
            if (err) reject(err);
            else resolve(stats);
            // console.log(`Is file: ${stats.isFile()}`);
            // console.log(`Is directory: ${stats.isDirectory()}`);
            // console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
            // console.log(`Is FIFO: ${stats.isFIFO()}`);
            // console.log(`Is socket: ${stats.isSocket()}`);
            // console.log(`Is character device: ${stats.isCharacterDevice()}`);
            // console.log(`Is block device: ${stats.isBlockDevice()}`);
        });
    });
}

function rmDir(path) {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, {recursive: true}, err => {
            if (err) reject(err);
            else resolve(!err);
        });
    });
}


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

function mkdir(path) {
    return new Promise((resolve, reject) => {
        console.log(path);
        if(fs.existsSync(path.dirname(path))) {
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


function readFileData(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function saveFileData(filePath, data, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, encoding,  (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

function unlinkFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,  (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

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
