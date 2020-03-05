/**
 * Some simple filesystem system operations aka PersistentManager for files.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let path = require('path');
let config = require('../../config/Config');
let fileUtils =require('./FileUtils');
let fileType = require('file-type');

/**
 * try and detect mimeType / file-extension based on the first bytes of the file content.
 *
 * @param filePath
 * @returns {Promise<{ext: string, mime: string}>}
 */
async function checkFileType (filePath) {
    if (await fileUtils.checkFileExists(filePath)) {
        let r = await fileType.fromFile(filePath);
        if (r)
            return r; //=> {ext: 'png', mime: 'image/png'}
        else // undefined => probably text or some unknown format
            return  {ext: 'txt', mime: 'text/plain'};
    }else {
        throw Error("file not found");
    }
}

/**
 * reads the content of a file.
 * if external is false, fileName will be prefixed with config.files.prefix witch determines the data location for all files in the database.
 * if external is true fileName will interpreted as a fixed absolute path.
 *
 * @param fileName: filePath
 * @param external: boolean
 * @returns {Promise<string>}
 */
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

/**
 * writes data into file specified by fileName.
 * fileName will always be prefixed with config.files.prefix, because we dont want to write stuff elsewhere.
 *
 * @param fileName
 * @param override: boolean,  if true target will be overwritten if it exists.
 * @param data: some string or byte data
 * @returns {Promise<*>}
 */
async function saveFile(fileName, override = false, data) {
    console.info("saving file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    await fileUtils.mkdirs(fileName);
    if (!override && (await fileUtils.checkFileExists(fileName))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    return await fileUtils.saveFileData(fileName, data);
}

/**
 * deletes file from storage. fileName will be prefixed with config.files.prefix.
 *
 * @param fileName
 * @returns {Promise<void>}
 */
async function deleteFile(fileName) {
    console.info("deleting file: " + fileName);
    fileName = path.join(config.files.prefix, fileName);
    if (!(await fileUtils.checkFileExists(fileName))) {
        throw Error ("file does not exist");
    }
    fileUtils.unlinkFile(fileName);
}

/**
 * moves file from fileNameSource to fileNameTarget.
 * if fromExternal is set to true fileNameSource will not be prefixed with config.files.prefix and interpreted as an absolute path.
 *
 * @param fileNameSource
 * @param fileNameTarget
 * @param override: boolean
 * @param fromExternal: boolean
 * @returns {Promise<*>}
 */
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
