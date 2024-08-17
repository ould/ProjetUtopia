const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const { haveDroits} = require('./helpers/role_check')
//require('./helpers/init_redis')

const cors = require("cors");

const AuthRoute = require('./Routes/Auth.route')
const personneRouter = require('./Routes/personne.route')
const familleRouter = require('./Routes/Famille.route')
const chatRouter = require('./Routes/Chat.route')
const messageRouter = require('./Routes/Message.route')
const personneTypeRouter = require('./Routes/PersonneType')
const userRouter = require('./Routes/User.route')
const selfUserRouter = require('./Routes/SelfUser.route')
const initialiseRouter = require('./Routes/Initialise.route')
const antenneRouter = require('./Routes/Antenne.route')
const logRouter = require('./Routes/Log.route')
const logPublicRouter = require('./Routes/Log.route')
const publicRouter = require('./Routes/Public.route')

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

// TODO : A voir pour les droits  req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'

//Routes Admin
app.use('/api/profil', verifyAccessToken, haveDroits, )
app.use('/api/user', verifyAccessToken,haveDroits, userRouter)
app.use('/api/personneType', verifyAccessToken,haveDroits, personneTypeRouter)
app.use('/api/Log', verifyAccessToken, haveDroits, logRouter)
app.use('/api/personne', verifyAccessToken, haveDroits, personneRouter) // TODO : faire passer les demandes de personne par les route selon le type (famille, mineur etc)

//Routes beneficiaire
app.use('/api/'+ process.env.contexte_famille, verifyAccessToken, haveDroits, familleRouter)

//Routes communes internes restreintes
app.use('/api/'+process.env.contexte_chat, verifyAccessToken, haveDroits, chatRouter) 
app.use('/api/message', verifyAccessToken, haveDroits, messageRouter) //TODO faire passer message par al route chat 

//Routes communes internes libres
app.use('/api/antenne', verifyAccessToken, antenneRouter)
app.use('/api/selfUser', verifyAccessToken, selfUserRouter)

//Routes publiques
app.use('/api/auth', AuthRoute)
app.use('/api/public', publicRouter)
app.use('/api/initialise', initialiseRouter)
app.use('/api/log', logRouter)


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
