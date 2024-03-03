const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const { haveAdminRole, haveRoleFamille } = require('./helpers/role_check')
//require('./helpers/init_redis')

const cors = require("cors");

const AuthRoute = require('./Routes/Auth.route')
const personneRouter = require('./Routes/personne.route')
const familleRouter = require('./Routes/Famille.route')
const chatRouter = require('./Routes/Chat.route')
const messageRouter = require('./Routes/Message.route')
const groupeRouter = require('./Routes/Groupe.route')
const personneTypeRouter = require('./Routes/PersonneType')
const userRouter = require('./Routes/User.route')

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

const app = express()

app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/auth', AuthRoute)
app.use('/api/groupe', verifyAccessToken, haveAdminRole, groupeRouter)
app.use('/api/user', verifyAccessToken, haveAdminRole, userRouter)
app.use('/api/famille', verifyAccessToken, haveRoleFamille, familleRouter)
app.use('/api/chat', verifyAccessToken, chatRouter)
app.use('/api/personne', verifyAccessToken, personneRouter)
app.use('/api/personneType', verifyAccessToken, haveAdminRole, personneTypeRouter)
app.use('/api/message', verifyAccessToken, messageRouter)
app.use('/api/groupe', verifyAccessToken, haveAdminRole, groupeRouter)

app.get('/api', async (req, res, next) => {
  res.send('Hello !!')
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
