import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

assert(process.env.PR_TITLE, 'PR_TITLE is required');
execFileSync(process.execPath, ['node_modules/@commitlint/cli/cli.js'], {
  input: process.env.PR_TITLE,
  stdio: ['pipe', 'inherit', 'inherit'],
});
