import React, { useState, useEffect } from "react"

const FlightControls = ({ DroneConnection }) => {

    const [controlSensitivity, setControlSensitivity] = useState(20) // Range 20-500 cm
    const [rotationSensitivity, setRotationSensitivity] = useState(5) // Range 1-3600 degrees
    const [speedSetting, setSpeedSetting] = useState(10) // Range 10-100 cm/s

    const droneIP = '192.168.10.1'
    const commandPORT = 8889

    const sendCommand = (droneCommand) => {
        DroneConnection.send(droneCommand, 0, droneCommand.length, commandPORT, droneIP, (error, bytes) => {
            if (error) throw error
            else {
                console.log('Command : ' + droneCommand)
            }
        })
    }

    useEffect(() => {
        // Initial Startup Command
        sendCommand('command')

        // Maintain Connection (Every 15 Seconds)
        const commandInterval = setInterval(() => {
            sendCommand('command')
        }, 15000)

        return () => clearInterval(commandInterval)
    }, [])

    return (
        <div>
            <div className="takeoffButton">
                <button onClick={() => sendCommand('takeoff')}>
                    Take off
                </button>
            </div>
            <div className="landButton">
                <button onClick={() => sendCommand('land')}>
                    Land
                </button>
            </div>
            <div className="upButton">
                <button onClick={() => sendCommand('up ' + controlSensitivity)}>
                    Up
                </button>
            </div>
            <div className="downButton">
                <button onClick={() => sendCommand('down ' + controlSensitivity)}>
                    Down
                </button>
                <div className="ccwButton">
                    <button onClick={() => sendCommand('ccw ' + rotationSensitivity)}>
                        Counter Clockwise
                    </button>
                </div>
            </div>
            <div className="leftButton">
                <button onClick={() => sendCommand('left ' + controlSensitivity)}>
                    Left
                </button>
            </div>
            <div className="rightButton">
                <button onClick={() => sendCommand('right ' + controlSensitivity)}>
                    Right
                </button>
            </div>
            <div className="cwButton">
                <button onClick={() => sendCommand('cw ' + rotationSensitivity)}>
                    Clockwise
                </button>
            </div>
            <div className="forwardButton">
                <button onClick={() => sendCommand('forward ' + controlSensitivity)}>
                    Forward
                </button>
            </div>
            <div className="backButton">
                <button onClick={() => sendCommand('back ' + controlSensitivity)}>
                    Back
                </button>
            </div>
            <div className="speedButton">
                <button onClick={() => sendCommand('speed ' + speedSetting)}>
                    Set Speed - Hardcoded at 10 cm/s
                </button>
            </div>
            <div className="streamOnButton">
                <button onClick={() => sendCommand('streamon')}>
                    Stream On
                </button>
            </div>
            <div className="streamOffButton">
                <button onClick={() => sendCommand('streamoff')}>
                    Stream Off
                </button>
            </div>
            <div className="emergencyButton">
                <button onClick={() => sendCommand('emergency')}>
                    Emergency
                </button>
            </div>
            <div className="batteryStatus">
                <button onClick={() => sendCommand('battery?')}>
                    Battery Status
                </button>
            </div>
        </div>
    )
}

export default FlightControls