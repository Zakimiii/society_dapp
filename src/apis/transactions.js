const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers');

module.exports = function transactionMiddleware(app) {
    var router = express.Router();
    app.use('/api/v1/transactions', router);
    router.use(bodyParser.json());
    router.get('/', function (req, res) {
        if (req.body.value) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(req.body.value + '\n');
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Invalid API Syntax\n');
        }
  });
}
