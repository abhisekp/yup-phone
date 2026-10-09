import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const adapter = require('./commitizen-adapter.cjs');
const { config } = require('../package.json');
const cli = path.resolve('node_modules/@commitlint/cli/cli.js');

/** Exercise commitlint with a message without creating any Git commit. */
function lint(message) {
  return execFileSync(process.execPath, [cli], {
    input: message,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

const mappings = {
  feature: 'feat',
  wip: 'chore',
  upgrade: 'build',
  'fix-ci': 'fix',
  refactoring: 'refactor',
  'dep-rm': 'build',
  'dep-add': 'build',
  config: 'chore',
  i18n: 'feat',
  typo: 'docs',
  poo: 'chore',
  merge: 'chore',
  'dep-up': 'build',
  breaking: 'feat',
  review: 'fix',
  'docs-code': 'docs',
  db: 'feat',
  'building-construction': 'refactor',
  'see-no-evil': 'chore',
};
for (const type of config['cz-emoji'].types) {
  const input = `${type.name}(phone): ${type.code} improve validation\n\nRefs: #822`;
  const message = adapter.normalizeMessage(input);
  assert(
    message.startsWith(
      `${mappings[type.name] ?? type.name}(phone)${type.name === 'breaking' ? '!' : ''}: ${type.code}`,
    ),
  );
  assert(message.endsWith('Refs: #822') || type.name === 'breaking');
  lint(message);
  lint(`${type.code} (phone) improve validation`);
}
const explicitBreaking = adapter.normalizeMessage(
  'feature(phone): :sparkles: change API\n\nBREAKING CHANGE: remove old arguments',
);
assert.equal(explicitBreaking.match(/BREAKING CHANGE:/gu).length, 1);
lint(explicitBreaking);
for (const invalid of [
  'random words',
  'feat:',
  'unknown: value',
  ':unknown: change',
  `feat: ${'a'.repeat(121)}`,
]) {
  assert.throws(() => lint(invalid));
}

// Run the real cz-emoji prompts with deterministic answers, without a Git commit.
const prompt = () =>
  Promise.resolve({
    type: { name: 'feature', emoji: ':sparkles:' },
    scope: 'phone',
    subject: 'add validator',
    body: '',
    breakingBody: '',
    issues: '',
  });
const registeredPrompts = new Set();
prompt.registerPrompt = (name, constructor) => {
  assert.equal(typeof constructor, 'function');
  registeredPrompts.add(name);
};
const columns = Object.getOwnPropertyDescriptor(process.stdout, 'columns');
Object.defineProperty(process.stdout, 'columns', {
  value: 120,
  configurable: true,
});
try {
  const prompted = await new Promise((resolve) =>
    adapter.prompter({ prompt }, resolve),
  );
  assert.equal(prompted, 'feat(phone): :sparkles: add validator');
  assert.deepEqual([...registeredPrompts], ['autocomplete', 'maxlength-input']);
} finally {
  if (columns) Object.defineProperty(process.stdout, 'columns', columns);
  else delete process.stdout.columns;
}
console.log(
  `Commitlint and real cz-emoji adapter passed for ${config['cz-emoji'].types.length} retained categories.`,
);
