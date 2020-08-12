/**
 * Some simple filesystem system operations aka PersistentManager for files.
 *
 * Created by Max Kuhmichel at 7.2.2020
 */

let fs = require('fs');
let fsPromises = fs.promises;
let path = require('path');
let config = require('../../config/Config');
let fileUtils = require('./FileUtils');
let fileType = require('file-type');

/**
 * try and detect mimeType / file-extension based on the first bytes of the file content.
 *
 * @param filePath
 * @returns {Promise<{ext: string, mime: string}>}
 */
async function checkFileType(filePath) {
    if (await fileUtils.checkFileExists(filePath)) {
        let r = await fileType.fromFile(filePath);
        if (r)
            return r; //=> {ext: 'png', mime: 'image/png'}
        else // undefined => probably text or some unknown format
            return {ext: 'txt', mime: 'text/plain'};
    } else {
        throw Error("file not found");
    }
}

/**
 * reads the content of a file.
 * if external is false, fileName will be prefixed with config.files.prefix witch determines the data location for all files in the database.
 * if external is true fileName will interpreted as a fixed absolute path.
 *
 * @param filePath: filePath
 * @param external: boolean
 * @returns {Promise<string>}
 */
function readFile(filePath) {
    console.info("reading file: " + filePath);
    return fsPromises.access(filePath, fs.R_OK)
        .then(() => fsPromises.readFile(filePath, "utf-8"));
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
async function saveFile(filePath, override = false, data = null) {
    console.info("saving file: " + filePath);
    await fileUtils.mkdirs(filePath);
    if (!override && (await fileUtils.checkFileExists(filePath))) {
        throw Error("file with that path and name already exists! (override false)");
    }
    return await fileUtils.saveFileData(filePath, data);
}

/**
 * deletes file from storage. fileName will be prefixed with config.files.prefix.
 *
 * @param fileName
 * @returns {Promise<void>}
 */
async function deleteFile(filePath) {
    console.info("deleting: " + filePath);
    if (!(await fileUtils.checkFileExists(filePath))) {
        console.warn("refusing to delete non-existing file: %s", fileName);
        return;
    }
    if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath,  {recursive: true});
    } else {
        fileUtils.unlinkFile(filePath);
    }
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
    console.info("moving file from " + fileNameSource + " to " + fileNameTarget);
    await fileUtils.mkdirs(fileNameTarget);
    if (!(await fileUtils.checkFileExists(fileNameSource))) {
        throw Error("source does not exist");
    }
    if (!override && await fileUtils.checkFileExists(fileNameTarget)) {
        throw Error("target file does already exist");
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
