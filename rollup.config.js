// import resolve from 'rollup-plugin-node-resolve'
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