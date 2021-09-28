import {
    commandPORT,
    droneIP,
    localListenerIP,
    statePORT,
    videoPORT,
} from './networkConfig.js'

import dgram from 'dgram'
import { send } from './udpClient.js'

// create the server is as simple as this
const server = dgram.createSocket('udp4')

// if there's an error I want the world to know
server.on('error', (error) => {
    console.log('ERR: ' + error)
    // server.close()
})

// announce listening success
server.on('listening', () => {
    const address = server.address()
    console.log(`Server listening on ${address.address}:${address.port}`)
    // console.log(server.address())
})

// inbound to console.log

server.on('message', (message, request) => {
    console.log(`SERVER rec'd: ${request.address}:${request.port}: ${message}`)
    send(message, request.port, request.address)

    // console.log(
    //     '%d bytes from %s:%d\n',
    //     message.length,
    //     request.address,
    //     request.port
    // )
})

// // COMMAND
// // listening for reply
// server.bind({
//     address: localListenerIP,
//     port: commandPORT,
// })

let testPORT = 8891

// STATE
// listening for reply
server.bind({
    address: localListenerIP,
    port: statePORT,
})

// // VIDEO
// // listening for reply
// server.bind({
//     address: localListenerIP,
//     port: videoPORT,
// })
