require('./db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workOrderSchema = new Schema(
    {
        customer: String,
        date: Date,
        time: Date,
        pilot: String,
        flight_plan: Array,
        flight_data: Array,
        analytics: {
            video: String,
        },
        status: String,
        jobTitle: String,
        jobNumber: String,
        jobDetails: String,
        clientContact: String,
        clientEmail: String,
        customerName: String,
        customerID: String,
        videoURL: String,
    },
    { strict: true, versionKey: false }
)

module.exports = mongoose.model('Work_Order', workOrderSchema, 'work_orders')
