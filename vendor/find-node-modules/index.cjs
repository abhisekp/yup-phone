const { statSync } = require('node:fs');
const path = require('node:path');

/** Find parent module directories for Commitizen without a glob parser dependency. */
module.exports = function findNodeModules(options = {}) {
  const settings = typeof options === 'string' ? { cwd: options } : options;
  const start = path.resolve(settings.cwd ?? process.cwd());
  const name = settings.searchFor ?? 'node_modules';
  if (
    typeof name !== 'string' ||
    !name ||
    /[\\/{}*?[\]]/u.test(name) ||
    name === '..' ||
    name === '.'
  ) {
    throw new TypeError('searchFor must be a literal directory name');
  }
  const found = [];
  let directory = start;
  while (true) {
    const candidate = path.join(directory, name);
    try {
      if (statSync(candidate).isDirectory()) {
        found.push(
          settings.relative === false
            ? candidate
            : path.relative(start, candidate),
        );
      }
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code))
        throw error;
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  return found;
};
