const { config } = require('./package.json');

const types = new Set([
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
]);
const emojis = new Set(
  config['cz-emoji'].types.flatMap(({ code, emoji }) => [code, emoji]),
);

/** Accept conventional release headers and the project's historical Gitmoji style. */
function projectHeader({ header }) {
  const conventional = /^([a-z]+)(?:\([^)\r\n]+\))?!?:\s+(\S.*)$/u.exec(
    header ?? '',
  );
  const legacy = /^(\S+)\s+(?:\([^)\r\n]+\)\s*)?(\S.*)$/u.exec(header ?? '');
  const valid = conventional
    ? types.has(conventional[1])
    : Boolean(legacy && emojis.has(legacy[1]));
  return [
    valid,
    'Use type(scope): subject, optionally with an emoji, or the configured Gitmoji header.',
  ];
}

module.exports = {
  plugins: [{ rules: { 'project-header': projectHeader } }],
  rules: {
    'project-header': [2, 'always'],
    'header-max-length': [2, 'always', 120],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
