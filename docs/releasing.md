# Release setup

The repository uses one npm lockfile and GitHub Actions. Node 24 supplies the
modern npm CLI needed for trusted publishing. Do not restore the retired Travis
deploy key, old semantic-release setup, or duplicate lockfiles.

## One-time setup

1. In the npm settings for `yup-phone`, add a GitHub Actions trusted publisher:
   organization/user `abhisekp`, repository `yup-phone`, workflow `release.yml`,
   environment `npm`. Follow [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).
   Only a package owner can establish this trust; no npm token is committed or
   required by this workflow. Ensure the environment name matches exactly.
2. In repository Actions settings, allow Actions to create pull requests. For
   repositories that require PR checks, set `RELEASE_PLEASE_TOKEN` to a narrowly
   scoped GitHub App or fine-grained token with contents and pull-request write
   permissions. This lets GitHub run CI on Release Please's generated PRs. The
   default `GITHUB_TOKEN` can create the version PR, but GitHub suppresses events
   triggered by that token. The release workflow still verifies before tagging
   and again before publishing.
3. Protect master with CI and CodeQL checks. The optional `npm` environment can
   require a maintainer's approval before publication.

## Normal release

Merge conventional commits into master. Use `fix:` for patches, `feat:` for
features, and `feat!:` or a `BREAKING CHANGE:` footer for a major release.

Release Please opens or updates a version/changelog PR. Merging that version PR
creates a Git tag and GitHub Release. In the same workflow run, publication
checks the tagged source, audits dependencies, packs the package, publishes to
npm with provenance, and attaches the tarball and benchmark reports to the
GitHub Release. This avoids relying on another workflow being triggered by a
bot-created tag or release event.

For the first migration, the release manifest starts at 1.3.2 and the breaking
migration commit requests 2.0.0. Thereafter versions advance normally.

## Local checks

```sh
npm ci --ignore-scripts
npm run check
npm run test:baseline
npm run format:check
npm audit --audit-level=low
npm run benchmark
npm pack --ignore-scripts
```

The CI compatibility matrix additionally installs Yup 0.32.11 and 1.0.0 without
changing the lockfile. Types are checked with library checks enabled. Native
TypeScript runs in single-thread mode to avoid excessive checker memory use on
the older Yup declarations.

Do not publish if required checks fail. When a scheduled audit or metadata
comparison fails, update the dependency/lockfile and investigate any behavior
change before accepting it.

If tagging succeeded but publication failed, rerun the failed workflow jobs or
dispatch the Release workflow with the existing tag (for example `v2.0.0`). It
verifies the exact tag, package version and master ancestry before testing and
publishing the packed tarball. Never move an existing release tag to retry.
If npm publication already succeeded, a retry only continues when the packed
tarball's integrity matches that existing npm version; differing contents fail.
