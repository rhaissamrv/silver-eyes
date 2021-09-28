import React, { useEffect, useContext } from 'react'
import throttle from 'lodash.throttle'
import TelemetryContext from '../TelemetryContext'
import './Telemetry.css'

const Telemetry = ({ DroneState }) => {
    const telemetryContext = useContext(TelemetryContext)

    useEffect(() => {
        DroneState.on(
            'message',
            throttle(
                (telemetryInformationStream) => {
                    telemetryContext.telemetryUpdate(
                        parseState(telemetryInformationStream.toString())
                    )
                },
                33,
                { trailing: true }
            )
        ) //30 FPS Refresh Rate
    }, [])

    const parseState = (state) => {
        return state
            .split(';')
            .map((x) => x.split(':'))
            .reduce((data, [key, value]) => {
                data[key] = value
                return data
            }, {})
    }

    return (
        // V1.0 strictly for Friday demo day
        <div className="telemetry-container">
            <div className="telemetry-display begin">
                <p style={{ color: 'orchid' }}>
                    Pitch:{' '}
                    <span className="plex">{telemetryContext.pitch}&deg;</span>
                </p>
                <p style={{ color: 'orchid' }}>
                    Yaw:{' '}
                    <span className="plex">{telemetryContext.yaw}&deg;</span>
                </p>
                <p style={{ color: 'orchid' }}>
                    Roll:{' '}
                    <span className="plex">{telemetryContext.roll}&deg;</span>
                </p>
            </div>
            <div
                className="telemetry-display middle"
                style={{ color: 'cornflowerblue' }}
            >
                <p>Altitude:</p>
                <p>
                    <span className="plex">{telemetryContext.altitude} cm</span>
                </p>
                <p>ToF Distance:</p>
                <p>
                    <span className="plex">
                        {telemetryContext.timeOfFlightDistance} cm
                    </span>
                </p>
            </div>
            <div
                className="telemetry-display middle"
                style={{ color: 'olive' }}
            >
                <p>Speed:</p>
                <p>
                    X:{' '}
                    <span className="plex">{telemetryContext.speedX} cm/s</span>
                </p>
                <p>
                    Y:{' '}
                    <span className="plex">{telemetryContext.speedY} cm/s</span>
                </p>
                <p>
                    Z:{' '}
                    <span className="plex">{telemetryContext.speedZ} cm/s</span>
                </p>
            </div>
            <div
                className="telemetry-display middle"
                style={{ color: 'brown' }}
            >
                <p>Acceleration:</p>
                <p>
                    X:{' '}
                    <span className="plex">
                        {telemetryContext.accelerationX} cm/s&sup2;
                    </span>
                </p>
                <p>
                    Y:{' '}
                    <span className="plex">
                        {telemetryContext.accelerationY} cm/s&sup2;
                    </span>
                </p>
                <p>
                    Z:{' '}
                    <span className="plex">
                        {telemetryContext.accelerationZ + 1000} cm/s&sup2;
                    </span>
                </p>
            </div>
            <div className="telemetry-display end">
                <p style={{ color: 'tomato' }}>
                    Battery:{' '}
                    <span className="plex">{telemetryContext.battery}%</span>
                </p>
                <p style={{ color: 'darkmagenta' }}>
                    Temp:{' '}
                    <span className="plex">
                        {telemetryContext.lowTemp}-{telemetryContext.highTemp}
                        &deg;C
                    </span>
                </p>
                <p> Motor Time:</p>
                <p>
                    <span className="plex">
                        {telemetryContext.motorRunTime} s
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Telemetry

// // V0.1
// <div className="telemetry-container">
//     <div>
//         <p> Telemetry:</p>
//         <p> Pitch: {telemetryContext.pitch}&deg;</p>
//         <p> Yaw: {telemetryContext.yaw}&deg;</p>
//         <p> Roll: {telemetryContext.roll}&deg;</p>
//         <p> Altitude: {telemetryContext.altitude} cm</p>
//         <p>
//             {' '}
//             ToF Sensor Distance: {
//                 telemetryContext.timeOfFlightDistance
//             }{' '}
//             cm
//         </p>
//         <p> Battery: {telemetryContext.battery}%</p>
//         <p> Speed X: {telemetryContext.speedX} cm/s</p>
//         <p> Speed Y: {telemetryContext.speedY} cm/s</p>
//         <p> Speed Z: {telemetryContext.speedZ} cm/s</p>
//         <p>
//             {' '}
//             Acceleration X: {telemetryContext.accelerationX} cm/s&sup2;
//         </p>
//         <p>
//             {' '}
//             Acceleration Y: {telemetryContext.accelerationY} cm/s&sup2;
//         </p>
//         <p>
//             {' '}
//             Acceleration Z: {telemetryContext.accelerationZ} cm/s&sup2;
//         </p>
//         <p>
//             {' '}
//             Temperature: {telemetryContext.lowTemp}-
//             {telemetryContext.highTemp}&deg;C
//         </p>
//         <p> Motor Run Time: {telemetryContext.motorRunTime} s</p>
//     </div>
// </div>
