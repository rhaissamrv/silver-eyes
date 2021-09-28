import './DroneStatus.css'

import React, { useEffect, useState, useContext } from 'react'
import TelemetryContext from '../TelemetryContext' //use this context to store drone status as well


const DroneStatus = ({ DroneConnection }) => {
    const [connectionStatus, setConnectionstatus] = useState('Disconnected')

    let [connectionIndicator, setConnectionIndicator] = useState('alert')

    // const telemetryContext = useContext(TelemetryContext)

    let colours = {
        disconnected: 'red',
        alert: 'orange',
        connected: 'green'
    }

    let connectionStyle = {
        // backgroundColor: `${colours.alert}`
    }

    //console.log(connectionStyle)

    switch (connectionStatus) {
        case 'Connected':
            // setConnectionIndicator('1')
            connectionStyle = { backgroundColor: `${colours.connected}` }
            // console.log('Connection indicator bullet: connected.')
            break
        case 'Disconnected':
            // setConnectionIndicator('0')
            connectionStyle = { backgroundColor: `${colours.disconnected}` }
            // console.log('Connection indicator bullet: disconnected.')
            break
        default:
            // setConnectionIndicator('x')
            connectionStyle = { backgroundColor: `${colours.alert}` }
            console.log('Connection indicator bullet: failed to initalize.')
    }

    //Initial Connection
    useEffect(() => {
        // Initial Reception Check
        let receptionCheck = setTimeout(() => {
            setConnectionstatus('Disconnected')
            // setConnectionIndicator('init')
            console.log('No Reception')
        }, 16000)

        // Message Handling
        DroneConnection.on('message', (msg) => {
            // Reception Listener
            if (msg !== null) {
                setConnectionstatus('Connected')
                // telemetryContext.setDroneStatus('Connected')
                // setConnectionIndicator('connected')
                console.log('Response : ' + msg.toString()) // Response from Drone

                // Subsequest Reception Check Timer
                clearTimeout(receptionCheck) // Reception Status Updated
                receptionCheck = setTimeout(() => {
                    setConnectionstatus('Disconnected')
                    // telemetryContext.setDroneStatus('Disconnected')
                    // setConnectionIndicator('disconnected')
                    // document.documentElement.style.setProperty(
                    //     '--status',
                    //     'background-color: #FF0000'
                    // )

                    console.log('No Reception')
                }, 30000)
            } else {
                console.log('Response : Null')
                setConnectionIndicator('null')
            }
        })
    }, [])

    return (
        <div>
            <div className="status-container">
                <div className="bullet" style={connectionStyle}></div>
                {connectionStatus}
            </div>
        </div>
    )
}

export default DroneStatus
