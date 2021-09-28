const mongoose = require('mongoose')
require('dotenv').config()

const databaseName = 'project3-drone-app'

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB is now connected:', `${process.env.MONGODB_URL}`)
})

db.on('error', (err) => console.error('MongoDB connection error!', err))

module.exports = db