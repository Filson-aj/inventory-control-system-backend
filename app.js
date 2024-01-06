const express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    configuration = require('./configs/server.config'),
    database = require('./configs/database.config'),
    { logEvents } = require('./middleware/logger'),
    PORT = process.env.PORT || 5000

//instantiate the express server
let app = express()

//basic configuration for the application
global.root = __dirname
global.images = path.join(__dirname, 'public', 'images', 'uploads', 'products')
app = configuration(app)

//start database
database.connnect()

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB')
    app.listen(PORT, console.log(`Server is running on: http://localhost:${PORT}`))
})

mongoose.connection.on('error', err =>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, `mongoErrLog.log`)
})