# Security

Report vulnerabilities privately using GitHub's security reporting for this repository.
Do not include phone numbers or other personal data in public issues.

CI audits the complete lockfile and production dependencies at every pull request,
push to master, and scheduled weekly run. Any reported vulnerability fails CI.
CodeQL scans JavaScript and TypeScript; Dependabot updates npm dependencies and
pinned GitHub Actions. Parsing rejects input longer than Google's legacy 250-character
limit. The production package depends only on libphonenumber-js and the application's
Yup peer. Google is a development-only benchmark/reference dependency.

Changes to phone metadata must pass the unchanged original tests, the reference
comparison, package consumer checks, and the supported Yup matrix before release.
