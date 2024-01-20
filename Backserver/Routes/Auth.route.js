const express = require('express')
const Authrouter = express.Router()
const AuthController = require('../Controllers/Auth.Controller')

Authrouter.post('/register', AuthController.register)

Authrouter.post('/login', AuthController.login)

// Authrouter.post('/refresh-token', AuthController.refreshToken)

// Authrouter.delete('/logout', AuthController.logout)

module.exports = Authrouter
