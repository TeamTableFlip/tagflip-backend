/**
 * Created by Jakub on 20.06.2017.
 *
 * Changed by Max Kuhmichel on 11.02.2020.
 */
const crypto = require('crypto');

/**
 * Creates a random salt with a specific length of hex-characters.
 * @param length The length of the salt. Represents the amount of hex values in the salt.
 * @returns {string} A random generated salt displayed in the hex format.
 */
function createSalt(length) {
    return crypto.randomBytes(length/2).toString('hex').slice(0, length);
}

/**
 * Creates a sh256 hash value using a clear text password and a hex-formatted salt.
 * @param password The password to be hashed.
 * @param salt The salt to be used to hash with the password.
 * @returns {Buffer|string} The SHA256 hex-formatted string of the password and the salt.
 */
function sha256(password, salt) {
    let shasum = crypto.createHmac('sha256', salt);
    shasum.update(password);
    return shasum.digest('hex');
}


module.exports = {
    createSalt,
    sha256
};
