const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
//require('./helpers/init_redis')

const AuthRoute = require('./Routes/Auth.route')
const personneRouter = require('./Routes/personne.route')
const familleRouter = require('./Routes/Famille.route')
const chatRouter = require('./Routes/Chat.route')
const messageRouter = require('./Routes/Message.route')


const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const app = express()

app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.use('/api/auth', AuthRoute)
app.use('/api/famille', verifyAccessToken, familleRouter)
app.use('/api/chat', verifyAccessToken, chatRouter)
app.use('/api/personne', verifyAccessToken, personneRouter)
app.use('/api/message', verifyAccessToken, messageRouter)

app.get('/api/', verifyAccessToken, async (req, res, next) => {
  res.send('Hello from express.')
})

app.get('/api/test', async (req, res, next) => {
  res.send('Hello from world.')
})
app.get('/api/test', async (req, res, next) => {
  res.send('Hello from world.')
})

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
