var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = function(watch) {
  return {
    entry: {
      app: './src/app.js'
    },
    output: {
      filename: 'app.js'
    },
    watch: watch,
    devtool: (process.env.NODE_ENV === 'production') ? 'source-map' : 'inline-source-map',
    module: {
      preLoaders: [{test: /\.js$/, exclude: [/node_modules/, /bower_components/], loader: 'jshint'}],
      loaders: [
        {test: /\.js$/, exclude: [/node_modules/, /bower_components/], loader: 'babel'},
        {test: /\.css$/, loader: 'style!css!postcss'},
        {test: /\.json$/, exclude: [/node_modules/, /bower_components/], loader: 'json'}
      ]
    },
    postcss: [autoprefixer({ browsers: ['last 2 version'] })],
    plugins: [
      new BowerWebpackPlugin({
        exclude: [
          /angular/,
          /angular-cookies/,
          /angular-sanitize/,
          /angular-resource/,
          /angular-messages/,
          /angular-translate/,
          /angular-touch/,
          /angular-mocks/,
          /js-data/,
          /js-data-angular/,
          /jquery/,
          /bootstrap-sass-official\/.*\.js/,
          /bootstrap\.css/,
          /awesome-bootstrap-checkbox/,
          /font-awesome/,
          /.*\.less/
        ],
        modulesDirectories: ['bower_components'],
        searchResolveModulesDirectories: false
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        moment: 'moment'
      }),
      new webpack.DefinePlugin({
        ENV_TEST: (JSON.stringify(process.env.NODE_ENV) === 'test') ? true : false
      }),
      new webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(require('./package.json').version)
      })
    ],
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.json', '.css']
    }
  };
};
