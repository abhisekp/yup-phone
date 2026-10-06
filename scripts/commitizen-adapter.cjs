const canonical = {
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

/** Retain emoji choices while giving Release Please a standard commit header. */
function normalizeMessage(message) {
  const [header, ...body] = message.split(/\r?\n/u);
  const match = /^([\w-]+)(\([^)]*\))?:\s+(\S.*)$/u.exec(header);
  if (!match) throw new Error('Expected the cz-emoji conventional header');
  const [, type, scope = '', subject] = match;
  const breaking = type === 'breaking';
  const footer = body.join('\n');
  const note =
    breaking && !/BREAKING[ -]CHANGE:/u.test(footer)
      ? `\n\nBREAKING CHANGE: ${subject}`
      : '';
  return `${canonical[type] ?? type}${scope}${breaking ? '!' : ''}: ${subject}${body.length ? `\n${footer}` : ''}${note}`;
}

module.exports = {
  normalizeMessage,
  /** Delegate the prompts to cz-emoji, preserving the project's types and scopes. */
  prompter(cz, commit) {
    require('cz-emoji').prompter(cz, (message) =>
      commit(normalizeMessage(message)),
    );
  },
};
