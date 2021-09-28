const express = require('express')
const router = express.Router()
const fileUpload = require("express-fileupload")

require('dotenv').config()

router.post('/upload_video', async (req, res) => {

    let filename = req.files.file.name
    let filedata = req.files.file.data

    // Load the AWS SDK for Node.js
    let AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({region: 'us-east-2'});

    // Create S3 service object
    let s3 = new AWS.S3();

    // call S3 to retrieve upload file to specified bucket
    let uploadParams = {Bucket: 'rmrvbucket', Key: filename, Body: filedata}

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
        if (err) {
            res.send(err)
            console.log("Error", err);
        } 
        if (data) {
            console.log("Upload Success", data.Location);
            res.send(data.Location)
    }
    })

})

router.get('/download_video/:filename', async (req, res) => {

    let filename = req.params.filename
    console.log (filename)

    // Load the AWS SDK for Node.js
    let AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({region: 'us-east-2'});

    // Create S3 service object
    let s3 = new AWS.S3();

    // call S3 to retrieve file from specified bucket
    let downloadParams = {Bucket: 'rmrvbucket', Key: filename}

    // call S3 to retrieve file to specified bucket
    let readstream

    try {
        let readstream = s3.getObject (downloadParams).createReadStream()
        readstream.pipe(res)
    } catch (error) {
        console.log('Error retreiving file from AWS')
        res.send ('Error')
    }
//    readstream.pipe(res)
})

module.exports = router