import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import pascalcase from 'pascalcase';
import {
  author,
  name,
  version
} from './package.json';

const isWatchMode = !!process.env.ROLLUP_WATCH;
const banner = `/* @license ${name} v${version} | (c) ${author} */`;

const config = {
  input: 'src/index.js',
  output: [{
      file: `dist/${name}.esm.js`,
      format: 'es',
      sourcemap: true,
      banner: banner
    },
    {
      file: `dist/${name}.umd.js`,
      name: pascalcase(name),
      format: 'umd',
      globals: {
        three: 'THREE'
      },
      sourcemap: true,
      banner: banner
    }
  ],
  plugins: [
    isWatchMode && eslint({
      exclude: 'node_modules/**',
      include: 'src/**'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      extensions: ['.js', '.json']
    }),
    commonjs()
  ],
  external: ['three']
};

export default config;
