// import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import * as meta from "./package.json";

const config = {
  input: "src/index.js",
  external: ['d3', 'lodash-es'],
  output: {
    file: `dist/${meta.name}.js`,
    name: "d3-explorer",
    format: "umd",
    indent: false,
    extend: true,
    globals: {
      'lodash-es': '_',
      'd3': 'd3'
    },
  },
  plugins: [
    // resolve()
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env',
          {
            modules: 'false',
            targets: {
              browsers: '> 1%, IE 11, not op_mini all, not dead',
              node: 8
            },
            // useBuiltIns: 'usage'
          }
        ]
      ]
    })
  ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      compact: true,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser()
    ]
  }
];