const express = require('express')
const logger = require('morgan') 
const path = require('path')
const stylus =require('stylus')
const nib = require('nib')

// Initiate App
const app = express()

function compile(str, path){
	return stylus(str)
	.set('filename', path)
	.use(nib())
}

// Load View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.static('static'))

// Routes
var router = require('./routers/router.js')
app.use(router)

// Declaring Port
const port = process.env.PORT || 8000

// Start Server
app.listen(port, function(){
	console.log('Listening on port ' + port)
}) 