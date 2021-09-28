const express = require('express')
const router = express.Router()
const User = require('../model/User')

//authentication
const bcrypt = require("bcryptjs")

// register new user
router.post('/', async function (req, res) {

    const hashedPW = await bcrypt.hash(req.body.password, 10)
    
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPW,
        account_type: req.body.account_type
    })
    
    const response = await newUser.save()
    
    res.send(response)

})

//check if e-mail is already registered
router.get('/', async (req, res) => {

    let email = req.query

    let data = await User.findOne(email)

    try {
         res.send(data);
    }
    catch (error) {
        res.sendStatus(500)
    }
})




module.exports = router