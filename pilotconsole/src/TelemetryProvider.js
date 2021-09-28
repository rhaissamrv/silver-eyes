import { useState } from 'react'
import TelemetryContext from './TelemetryContext'

const TelemetryProvider = ({ children }) => {

    const [pitch, setPitch] = useState(0)
    const [yaw, setYaw] = useState(0)
    const [roll, setRoll] = useState(0)
    const [altitude, setAltitude] = useState(0)

    const [battery, setBattery] = useState(0)

    const [speedX, setSpeedX] = useState(0)
    const [speedY, setSpeedY] = useState(0)
    const [speedZ, setSpeedZ] = useState(0)

    const [accelerationX, setAccelerationX] = useState(0)
    const [accelerationY, setAccelerationY] = useState(0)
    const [accelerationZ, setAccelerationZ] = useState(0)

    const [timeOfFlightDistance, setTimeOfFlightDistance] = useState(0)
    
    const [lowTemp, setLowTemp] = useState(0)
    const [highTemp, setHighTemp] = useState(0)

    const [motorRunTime, setMotorRunTime] = useState(0)

    const [droneStatus, setDroneStatus] = useState('Disconnected')



    let telemetryUpdate = (telemetryData) => {

        setPitch(Number(telemetryData.pitch)) // in degrees
        setYaw(Number(telemetryData.yaw)) // in degrees
        setRoll(Number(telemetryData.roll)) // in degrees
        setAltitude(Number(telemetryData.h)) //altitude in cm

        setBattery(Number(telemetryData.bat)) //battery level in %
        
        setSpeedX(Number(telemetryData.vgx)) //speed in cm/s
        setSpeedY(Number(telemetryData.vgy)) //speed in cm/s
        setSpeedZ(Number(telemetryData.vgz)) //speed in cm/s

        setAccelerationX(Number(telemetryData.agx)) //acceleration in cm/s2
        setAccelerationY(Number(telemetryData.agy)) //acceleration in cm/s2
        setAccelerationZ(Number(telemetryData.agz)) //acceleration in cm/s2

        setTimeOfFlightDistance(Number(telemetryData.tof)) //distance in cm

        setLowTemp(Number(telemetryData.templ)) // temperature in degC
        setHighTemp(Number(telemetryData.temph)) // temperature in degC

        setMotorRunTime (Number(telemetryData.time)) // time in seconds

    }

    let contextValue = {
        telemetryUpdate,
        pitch, 
        yaw,
        roll,
        altitude,
        battery,
        speedX,
        speedY,
        speedZ,
        accelerationX,
        accelerationY,
        accelerationZ,
        timeOfFlightDistance,
        lowTemp,
        highTemp,
        motorRunTime,
        setDroneStatus,
        droneStatus

        
    }

    return (
        <TelemetryContext.Provider value={contextValue}>
            {children}
        </TelemetryContext.Provider>
    )
}

export default TelemetryProvider