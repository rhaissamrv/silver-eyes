require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

// middleware for passport authentication
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')

app.use(
    session({ secret: 'secretToken', resave: true, saveUninitialized: true })
)
app.use(cookieParser('secretToken'))
app.use(passport.initialize())
app.use(passport.session())

// Middleware
const fileUpload = require("express-fileupload")
app.use(fileUpload())

app.use(express.json()) //JSON Parser
app.use(
    cors({
        origin: ['http://localhost:4444', 'http://localhost:3000'], // <-- location of the react apps we're connecting to
        credentials: true,
    })
)

// Authentication routes
const login = require('./routes/login')
const logout = require('./routes/logout')
const register = require('./routes/register')
app.use('/login', login)
app.use('/register', register)
app.use('/logout', logout)

// AWS routes
const awsRoute = require('./routes/uploadVideo')
app.use('/api/aws', awsRoute)

// Route Requirements [Express Router]
const users = require('./routes/users')
const work_orders = require('./routes/work_orders')

// Routes
app.use('/api/users', users)
app.use('/api/work_orders', work_orders)

//Set PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})
