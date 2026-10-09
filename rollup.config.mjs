import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: '.build/index.js',
  external: ['yup'],
  plugins: [nodeResolve({ browser: true }), commonjs()],
  output: [
    {
      file: 'dist/yup-phone.umd.js',
      format: 'umd',
      name: 'yupPhone',
      globals: { yup: 'yup' },
      sourcemap: true,
    },
    {
      file: 'dist/yup-phone.umd.min.js',
      format: 'umd',
      name: 'yupPhone',
      globals: { yup: 'yup' },
      sourcemap: true,
      plugins: [terser()],
    },
  ],
};
