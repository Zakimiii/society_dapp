const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers');

module.exports = function icoMiddleware(app) {
    var router = express.Router();
    app.use('/', router);
    router.use(bodyParser.json());
    router.get('/', controllers.ico_controller.index);
}
