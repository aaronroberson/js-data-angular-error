var express       = require('express');
var app           = express();
var http          = require('http');
var https         = require('https');
var httpProxy     = require('http-proxy');
var path          = require('path');
var fs            = require('fs');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var env           = process.env.NODE_ENV || 'development';
var middleware    = require('./middleware');
var httpsOptions;
var proxy;

/* ========================= MIDDLEWARE ======================= */

// Log each request to the console
app.use(logger('dev'));

// DISABLED bodyParser and cookieParser due to
// https://github.com/nodejitsu/node-http-proxy/issues/496

// have the ability to simulate DELETE and PUT
//app.use(bodyParser.json());

// have the ability to simulate DELETE and PUT
//app.use(bodyParser.urlencoded({extended: true}));

// have the ability to parse cookies
//app.use(cookieParser());

// Set the directory from which to server static files
app.use(express.static(path.join(__dirname, 'dist')));

/* ======================= SETTINGS ========================= */

var settings = {
  local: {
    PROTOCOL: 'http://',
    HOST: 'jsonplaceholder.typicode.com',
    PORT: 80,
  },
  development: {
    PROTOCOL: 'http://',
    HOST: 'jsonplaceholder.typicode.com',
    PORT: 80,
  },
  stage: {
    PROTOCOL: 'http://',
    HOST: 'jsonplaceholder.typicode.com',
    PORT: 80,
  },
  production: {
    PROTOCOL: 'http://',
    HOST: 'jsonplaceholder.typicode.com',
    PORT: 80,
  }
};

/* ============================ INIT ========================== */

if (env === 'local') {

  app.set('port', 8080);

  proxy = httpProxy.createProxyServer({
    target: 'http://jsonplaceholder.typicode.com'
  });

  http.createServer(app).listen(app.get('port'), function() {
    console.log('Foobar is now running on port ' + app.get('port'));
  });

} else {

  http.createServer(app).listen(80, function() {
    console.log('Non-secure Foobar is now running on port ' + 80);
  });

  app.set('port', 443);

  // Add changeOrigin for proxying outside localhost
  proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: settings[env].PROTOCOL + settings[env].HOST,
    secure: false
  });

}

proxy.on('error', function(err, req, res) {
  res.send(500, {msg: 'Something went wrong with the proxy server. Please contact an administrator.'});
});

/* ========================= ROUTES =========================== */

app.use('/api/*', function(req, res) {
  // When the route is mounted off of a given path,
  // it gets to pretend that it's off of the root.
  // Setting req.url to originalUrl overcomes this.
  req.url = req.originalUrl.split('/api')[1];
  proxy.web(req, res);
});

app.get('*', function(req, res) {
  // Load the Angular SPA /dist/index.html
  res.sendFile(__dirname + '/dist/index.html');
});

module.exports.app = app;
