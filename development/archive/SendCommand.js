export function socketHandling( {DroneConnection} ) {

    /// Drone Socket Connection ///

    // Error Handling
    DroneConnection.on('error', (error, info) => {
        console.log('Error Received From Drone : ' + error.toString())
        // DroneConnection.close()
    })

    // Connection & Listening
    DroneConnection.on('listening', () => {
        const address = DroneConnection.address()
        console.log(`Drone Connected & Listening on : ${address.address}:${address.port}`)
    })

    // Message Handling
    DroneConnection.on('message', (msg, info) => {
        console.log('Data Received From Drone : ' + msg.toString())
    })

}

// Send Command to Drone
const sendCommand = ( {DroneConnection} ) => {
    const droneCommand = 'command'
    const droneIP = '192.168.10.1'
    const commandPORT = 8889

    DroneConnection.send(droneCommand, 0, droneCommand.length, commandPORT, droneIP, (error, bytes) => {
        if (error) throw error
        else {
            console.log('Command : ' + droneCommand)
        }
    })

}

export default sendCommand