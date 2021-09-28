import dgram from 'dgram'

// create client
const client = dgram.createSocket('udp4')

//
// ** THIS MIGHT HELP
// If we need to convert IPs from strings
// to long integers at any point.

export function int2ip(ipInt) {
    return (
        (ipInt >>> 24) +
        '.' +
        ((ipInt >> 16) & 255) +
        '.' +
        ((ipInt >> 8) & 255) +
        '.' +
        (ipInt & 255)
    )
}

export function ip2int(ip) {
    return (
        ip.split('.').reduce(function (ipInt, octet) {
            return (ipInt << 8) + parseInt(octet, 10)
        }, 0) >>> 0
    )
}

// THIS MAY NO LONGER HELP
//

// creating the connection is apparently as simple as this
const server = dgram.createSocket('udp4')

// if there's an error I want the world to know
server.on('error', (error) => {
    console.log('ERR: ' + error)
    // server.close()
})

// gimmie updates
client.on('message', (msg, info) => {
    console.log('REC from SRV: ' + msg.toString())
    console.log(
        'Received %d bytes from %s:%d\n',
        msg.length,
        info.address,
        info.port
    )
})

// send a message
let message = 'hello world'
let testIP = '192.168.86.99'

export function send(message, port, ip) {
    server.send(Buffer.from(message), port, ip, (error) => {
        if (error) {
            console.log('SEND ERROR')
        } else {
            console.log(`SEND: ${message} to ${ip}:${port}\n`)
        }
    })
    // TEST
    // console.log('OUTBOUND:', message)
}

// TEST
// send('udpclient', statePORT, testIP)
