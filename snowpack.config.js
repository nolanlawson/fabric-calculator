const polyfills = require('rollup-plugin-node-polyfills')

module.exports = {
  extends: '@snowpack/app-scripts-svelte',
  scripts: {},
  devOptions: {},
  installOptions: {
    rollup: {
      plugins: [
        polyfills()
      ]
    }
  }
}
