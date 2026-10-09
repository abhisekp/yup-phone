const { transformSync } = require('esbuild');

module.exports = {
  /** Compile test TypeScript to CommonJS with inline source maps for Jest. */
  process(source, filename) {
    return transformSync(source, {
      loader: 'ts',
      format: 'cjs',
      target: 'node18',
      sourcemap: 'inline',
      sourcefile: filename,
    });
  },
};
