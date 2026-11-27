
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Home API
app.get('/', function (req, res) {
    res.send('COCOORA Backend is Running!')
})

// Products API
app.get('/products', function (req, res) {
    res.send('These are COCOORA products')
})

// Users API
app.get('/users', function (req, res) {
    res.send('These are COCOORA users')
})

// Start the server
const PORT = process.env.PORT || 5003

const server = app.listen(PORT, function () {
    console.log('Server started successfully!')
    console.log('Listening:', server.listening)
    console.log('Address:', server.address())
})

// Check if the server closes
server.on('close', function () {
    console.log('Server has been closed!')
})
