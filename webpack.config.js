const { buildWebpackConfig } = require('webpack-preset-accurapp')
const typescript = require('webpack-blocks-ts')

module.exports = buildWebpackConfig([typescript({ silent: true })])
