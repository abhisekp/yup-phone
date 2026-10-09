import { appendFile } from 'node:fs/promises';
import { prepareReleaseArtifact } from './release-artifact.mjs';

const release = await prepareReleaseArtifact();
if (process.env.GITHUB_OUTPUT) {
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `manifest-sha256=${release.digest}\ncommit=${release.commit}\n`,
  );
}
console.log(
  `Prepared ${release.tag} at ${release.commit}; manifest ${release.digest}.`,
);
