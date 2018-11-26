const express = require('express');
const http = require('http');
const jwtAuth = require('../..');

module.exports.create = function(middleware) {
  const app = express();

  app.use(middleware);

  app.get('/test', (req, res) => {
    res.json(req.openid);
  });

  app.get('/products',
    jwtAuth.requireScopes('read:products'),
    (req, res) => {
      res.json([]);
    });

  app.get('/orders',
    jwtAuth.requireScopes('read:orders'),
    (req, res) => {
      res.json([]);
    });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
      .json({ err: { message: err.message }});
  });

  const server = http.createServer(app);

  return new Promise((resolve) => {
    server.unref();
    server.listen(0, () => {
      resolve(`http://localhost:${server.address().port}`);
    });
  });
};