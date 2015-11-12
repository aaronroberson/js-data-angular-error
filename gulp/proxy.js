/*jshint unused:false */

/***************

 This file allow to configure a proxy system plugged into BrowserSync
 in order to redirect backend requests while still serving and watching
 files from the web project

 ***************/

'use strict';

var httpProxy = require('http-proxy');
var chalk = require('chalk');

module.exports = function(proxyTarget) {

  var proxy = httpProxy.createProxyServer({
    target: proxyTarget || 'http://jsonplaceholder.typicode.com',
    changeOrigin: true,
    headers: {
      host: 'jsonplaceholder.typicode.com'
    }
  });

  proxy.on('error', function(err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    console.error(chalk.red('[Proxy]'), err);
  });

  /*
   * The proxy middleware is an Express middleware added to BrowserSync to
   * handle backend request and proxy them to your backend.
   */
  function proxyMiddleware(req, res, next) {
    /*
     * This test is the switch of each request to determine if the request is
     * for a static file to be handled by BrowserSync or a backend request to proxy.
     *
     * The existing test checks if the request is to /api/* and proxies the request.
     */
    /api/.test(req.url) ? (req.url = req.originalUrl.split('/api')[1], proxy.web(req, res)) : next();
  }

  return [proxyMiddleware];
};

