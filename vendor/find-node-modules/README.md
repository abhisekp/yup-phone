# Commitizen module-directory lookup

This repository-local implementation supplies the `find-node-modules` API that
Commitizen uses to discover its adapter. It walks parent directories using Node's
filesystem API and supports `cwd`, `relative`, and a literal `searchFor` name.
Commitizen uses the literal `node_modules` directory. Glob searches are rejected.

The upstream dependency pulls in findup-sync, micromatch, and braces. The current
braces release has an unpatched stack-exhaustion advisory. Replacing this unused
glob machinery removes that dependency path rather than suppressing its audit.
This is development tooling only and is excluded from the published package.
`npm run test:commits` exercises module discovery and the real emoji adapter.
