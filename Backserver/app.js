const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const { haveAdminGroupe, haveGroupeFamille, haveGroupeChat, haveGroupeAstreinte, haveGroupeHommeSeul, haveGroupeMineur, haveDroits} = require('./helpers/role_check')
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
app.use('/api/groupe', verifyAccessToken, haveAdminGroupe, haveDroits, groupeRouter)
app.use('/api/user', verifyAccessToken, haveAdminGroupe,haveDroits, userRouter)
app.use('/api/personneType', verifyAccessToken, haveAdminGroupe,haveDroits, personneTypeRouter)
app.use('/api/Log', verifyAccessToken, haveAdminGroupe, haveDroits, logRouter)

//Routes famille
app.use('/api/famille', verifyAccessToken, haveGroupeFamille || haveGroupeAstreinte , haveDroits, familleRouter)

//Routes communes internes
app.use('/api/personne', verifyAccessToken, haveGroupeFamille || haveGroupeAstreinte || haveGroupeHommeSeul || haveGroupeMineur, haveDroits, personneRouter)
app.use('/api/chat', verifyAccessToken, haveGroupeChat, chatRouter)
app.use('/api/message', verifyAccessToken, haveGroupeChat, messageRouter)
app.use('/api/antenne', verifyAccessToken, antenneRouter)
app.use('/api/selfUser', verifyAccessToken, selfUserRouter)

//Routes publiques
app.use('/api/auth', AuthRoute)
app.use('/api/public', publicRouter)
app.use('/api/initialise', initialiseRouter)


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
