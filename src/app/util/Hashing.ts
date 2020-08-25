import * as crypto from 'crypto';
import {BinaryLike} from "crypto";

export default abstract class DocumentExtractor {

    /**
     * Creates a random salt with a specific length of hex-characters.
     * @param length The length of the salt. Represents the amount of hex values in the salt.
     * @returns {string} A random generated salt displayed in the hex format.
     */
    public static createSalt(length : number) {
        return crypto.randomBytes(length/2).toString('hex').slice(0, length);
    }

    /**
     * Creates a sh256 hash value using a clear text password and a hex-formatted salt.
     * @param password The password to be hashed.
     * @param salt The salt to be used to hash with the password.
     * @returns {Buffer|string} The SHA256 hex-formatted string of the password and the salt.
     */
    public static sha256SaltedPassword(password : BinaryLike, salt : BinaryLike) {
        let shasum = crypto.createHmac('sha256', salt);
        shasum.update(password);
        return shasum.digest('hex');
    }

    /**
     * Creates a sh256 hash value of data.
     * @param data data to be hashed.
     * @returns {Buffer|string} The SHA256 hex-formatted string.
     */
    public static sha256Hash(data: BinaryLike) {
        let shasum = crypto.createHash('sha256');
        shasum.update(data);
        return shasum.digest('hex');
    }

}





