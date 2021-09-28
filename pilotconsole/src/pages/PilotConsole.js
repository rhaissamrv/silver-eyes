import './PilotConsole.css'

import React, { useContext } from 'react'

import ArtificialHorizon from '../components/ArtificialHorizon'
import AuthenticationContext from '../AuthenticationContext'
// Pilot Console Components
import DroneStatus from '../components/DroneStatus'
import FlightControls from '../components/FlightControls'
import FlightMap from '../components/FlightMap_Leaflet'
import Header from '../components/Header'
import JobDetailContext from '../JobDetailContext'
import Orientation from '../components/Orientation'
import Telemetry from '../components/Telemetry'
import VideoFeed from '../components/VideoFeed'
import FlightRecording from '../components/FlightRecording'

const PilotConsole = ({ DroneConnection, DroneState, DroneVideoFeed }) => {
    const authContext = useContext(AuthenticationContext)
    const jobContext = useContext(JobDetailContext)

    return (
        <div className="console-container">
            <div className="console-app-header">
                <Header />
            </div>

            <div className="console-user-info">
                Welcome: {authContext.username}
                {authContext.username !== 'Guest Pilot'}
                {jobContext.activeJob ? (
                    <> | Job: {jobContext.activeJob.toString().slice(0, 8)}</>
                ) : (
                    <> | No job loaded</>
                )}
                <FlightRecording />
            </div>

            <div className="console-horizon">
                <ArtificialHorizon />
            </div>

            <div className="console-telemetry">
                <Telemetry DroneState={DroneState} />
            </div>

            <div className="console-orientation">
                <Orientation />
            </div>

            <div className="console-flightplan">
                <FlightMap displayExtras={'show'} />
            </div>

            <div className="console-drone-status">
                <DroneStatus DroneConnection={DroneConnection} />
            </div>

            <div className="console-video-feed">
                <VideoFeed DroneVideoFeed={DroneVideoFeed} />
            </div>

            <div className="console-controls">
                <FlightControls DroneConnection={DroneConnection} />
            </div>

            <div className="console-things-that-are-not-graphs">
                {/* VDR This is jsut something I put here until we have
                things that are not graphs */}
                Notes:
                <textarea id="notes" className="small-text quiet notes">
                    Calgary: 51.0447ºN, -114.0719ºW
                </textarea>
                {/* <span className="small-text quiet"></span> */}
            </div>

            {/* <div className="console-app-header">
                <Header />
                <p>TBD: app header content</p>
            </div> */}

            {/* <div className="console-flight-time">Drone Flight Time</div> */}
        </div>
    )
}

export default PilotConsole
