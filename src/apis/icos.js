const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers');

module.exports = function icoMiddleware(app) {
    var router = express.Router();
    app.use('/api/v1/icos', router);
    router.use(bodyParser.json());
    router.get('/', controllers.ico_controller.index);
    router.get('/buy', controllers.ico_controller.buy);
}
