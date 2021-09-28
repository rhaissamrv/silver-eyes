require('./db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
        account_type: String,
        username: String,
        email: String,
        password: String,
        work_orders: {
                pending: String,
                completed: String
        }
},
        { strict: true, versionKey: false })


module.exports = mongoose.model('User', userSchema, 'users')
