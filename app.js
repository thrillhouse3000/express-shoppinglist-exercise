const express = require('express');
const itemsRoutes = require('./itemsRouter')

const app = express();

app.use(express.json());
app.use('/items', itemsRoutes)

//global Error Handler
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;
    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;