const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {
    transactionMiddleware,
    icoMiddleware,
} = require('./apis');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

const routeBinding = (app) => {
    // app.get('/', (req, res) => res.send('Hello'));
    // app.get('/*', function(req, res) {
    //   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    // });
    app.use('/static', express.static('public'));
    transactionMiddleware(app);
    icoMiddleware(app);
}

routeBinding(app);

app.listen(3000, () => console.log('Listening on port 3000'));

export default app;
