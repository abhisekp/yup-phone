import { verifySourceRelease } from './release-artifact.mjs';

const release = await verifySourceRelease();
console.log(`Verified ${release.tag} at ${release.commit} on master.`);
