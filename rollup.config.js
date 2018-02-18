import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import pascalcase from 'pascalcase';
import {
  name as moduleName
} from './package.json';

const isWatchMode = !!process.env.ROLLUP_WATCH;

const config = {
  input: 'src/index.js',
  output: [{
      file: `dist/${moduleName}.esm.js`,
      format: 'es',
      sourcemap: true
    },
    {
      file: `dist/${moduleName}.umd.js`,
      name: pascalcase(moduleName),
      format: 'umd',
      globals: {
        three: 'THREE'
      },
      sourcemap: true
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
