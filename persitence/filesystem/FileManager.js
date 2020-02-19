/**
 * Some simple filesystem system operations.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let path = require('path');
let config = require('../../config/Config');
let fileUtils =require('./FileUtils');
let fileType = require('file-type');

async function checkFileType (filePath) {
    if (await fileUtils.checkFileExists(filePath)) {
        let r = await fileType.fromFile(filePath);
        if (r)
            return r; //=> {ext: 'png', mime: 'image/png'}
        else // undefined => probably text or some unknown format
            return  {ext: 'txt', mime: 'plain/text'};
    }else {
        throw Error("file not found");
    }
}

async function readFile(fileName, external = false) {
    if (!external)
        fileName = path.join(config.files.prefix, fileName);
    console.info("reading file: " + fileName);
    if (await fileUtils.checkFileExists(fileName)) {
        return (await fileUtils.readFileData(fileName)).toString();
    } else {
        throw Error("file not found");
    }
}

async function saveFile(fileName, override = false, data) {
    console.info("saving file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    await fileUtils.mkdirs(fileName);
    if (!override && (await fileUtils.checkFileExists(fileName))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    return await fileUtils.saveFileData(fileName, data);
}

async function deleteFile(fileName) {
    console.info("deleting file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    if (!(await fileUtils.checkFileExists(fileName))) {
        throw Error ("file does not exist");
    }
    fileUtils.unlinkFile(fileName);
}

async function moveFile(fileNameSource, fileNameTarget, override = false, fromExternal = false) {
    if (!fromExternal)
        fileNameSource = path.join(config.files.prefix, fileNameSource);
    fileNameTarget = path.join(config.files.prefix, fileNameTarget);
    console.info("moving file from " + fileNameSource + " to "+ fileNameTarget);
    await fileUtils.mkdirs(fileNameTarget);
    if (!(await fileUtils.checkFileExists(fileNameSource))) {
        throw Error ("source does not exist");
    }
    if (!override && await fileUtils.checkFileExists(fileNameTarget)) {
        throw Error ("target file does already exist");
    }
    return await fileUtils.copyFile(fileNameSource, fileNameTarget, !fromExternal);
}


module.exports = {
    readFile,
    saveFile,
    deleteFile,
    moveFile,
    checkFileType
};
