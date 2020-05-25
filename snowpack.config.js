const polyfills = require('rollup-plugin-node-polyfills')

module.exports = {
  extends: '@snowpack/app-scripts-svelte',
  scripts: {
    'bundle:*': '@snowpack/plugin-webpack'
  },
  devOptions: {
    bundle: true
  },
  installOptions: {
    rollup: {
      plugins: [
        polyfills()
      ]
    }
  },
  plugins: [
    '@snowpack/plugin-webpack'
  ]
}
