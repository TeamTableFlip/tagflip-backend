/**
 * currently unused. check node version to be above a certain number.
 * In our case node 12 is required.
 */
import semver from 'semver';
import { engines } from './package';

const version = engines.node;
if (!semver.satisfies(process.version, version)) {
    console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
    process.exit(1);
}
