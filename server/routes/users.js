const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.get('/', async (req, res) => {
    let queryString = req.query 
    let data = await User.find(queryString)
    try {
        res.send(data);
    }
    catch (error) {
        res.sendStatus(500)
    }
})


    




module.exports = router