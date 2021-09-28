import './WorkOrderDetails.css'

import React, { useEffect, useRef, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import AuthenticationContext from '../AuthenticationContext'

import videoMessage from '../assets/videoUnavailable.png'

import FlightPlan from './FlightPlan.js'

const WorkOrderDetails = () => {
    const flightId = useParams().id
    console.log('flightId:', flightId)

    const [userFlight, setUserFlight] = useState()
    const resetMapToggle = useRef(false) // required for flight plan component.  No reset required.

    const history = useHistory()

    const mapSize = useRef()

    const [date, setDate] = useState()
    const [time, setTime] = useState()

    const authContext = useContext(AuthenticationContext)

    // useLayoutEffect(() => {
    //     // console.log(`type`, typeof mapSize)
    //     // console.log(`mapSize`, mapSize)
    //     console.log(`mapSize.current.clientWidth`, mapSize.current.clientWidth)
    //     // let mapSizeWidth = mapSize.current.clientWidth
    //     // console.log(mapSizeWidth, `mapSizeWidth`)
    // }, [])

    useEffect(() => {
        const fetchFlight = async () => {
            let flightById = await fetch(
                `/api/work_orders/work_order/${flightId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log('userFlight:', userFlight)

            let responseData = await flightById.json()
            // console.log("flightById:", flightById);
            //console.log("responseData:", responseData);
            setUserFlight(responseData.flight)
            const flightDate = new Date(responseData.flight.date)
            setDate(flightDate.toDateString())
            setTime(flightDate.toLocaleTimeString())
            console.log(responseData.flight.date)
        }
        fetchFlight()
        // console.log('userFlight:', userFlight)
    }, [flightId])

    if (!userFlight) return null

    // const GetMapSizeOnLoad = (props) => {
    //     const mapSize = useRef()
    //     const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    //     useLayoutEffect(() => {
    //         if (mapSize.current) {
    //             setDimensions({
    //                 width: mapSize.current.offsetWidth,
    //                 height: mapSize.current.offsetHeight
    //             })
    //         }
    //     }, [])

    //     console.log(dimensions.width, `width`)
    //     return mapSize
    // }

    // GetMapSizeOnLoad()

    // useLayoutEffect(() => {
    // const getMapSize = async () => {

    //     let workOrderMap = await document.querySelector('workorder-map')
    //     let workOrderMapWidth = await workOrderMap.clientWidth
    //     console.log(workOrderMapWidth, `workOrderMapWidth`)
    // }

    // getMapSize()
    // })

    return (
        <div className="workorder-container">
            <div className="workorder-header">
                <div className="workorder-header-inner-container">
                    <div className="workorder-header-primary">
                        <h3>Hello, {authContext.username}.</h3>
                    </div>
                    <div className="workorder-header-secondary">
                        <h3>Work order</h3>
                        {/* Date: {userFlight.date} */}
                    </div>
                    <div className="workorder-header-tertiary">
                        {userFlight.id.slice(0, 8)}
                    </div>
                    {/* <div className="workorder-header-secondary"> */}
                    {/* Flight Time: {userFlight.time} */}
                    {/* </div> */}
                </div>
            </div>

            <div className="workorder-video-label">
                <h3>Analysis</h3>
            </div>
            {userFlight.videoURL && (
            <div className="workorder-video">
                <video
                    src={userFlight.videoURL}
                    width={'100%'}
                    height={'100%'}
                    margin={'0px'}
                    padding={'0px'}
                    muted={'muted'}
                    autoPlay
                    controls
                />
            </div>
            )}
            {!userFlight.videoURL && (
                <div className="workorder-video">
                <img
                    src={videoMessage}
                    alt={'This video is unavailable'}
                    width={'100%'}
                    height={'100%'}
                    margin={'0px'}
                    padding={'0px'}
                /> 
            </div>
            )}
                
            {/* <div>Analytics: {userFlight.analytics.video} </div>  */}

            <div className="workorder-details-label">
                <h3>Details</h3>
            </div>
            <div className="workorder-details">
                <div className="workorder-details-inner-container">
                    <div className="details-date plex">
                        <h4>Date:</h4> {date}
                    </div>
                    <div className="details-location plex">
                        <h4>Job Title:</h4> {userFlight.jobTitle}
                    </div>
                    <div className="details-pilot plex">
                        <h4>Pilot:</h4> {userFlight.pilot}
                    </div>
                    <div className="details-flight plex">
                        <h4>Flight Time:</h4> {time}
                    </div>
                    <div className="details-data plex">
                        <h4>Flight Waypoints:</h4> {userFlight.flight_data.map((waypoint) => {
                            console.log ("flight_data from waypoint:", userFlight.flight_data)
                            return (
                                <>
                                <>{waypoint[0]}, {waypoint[1]}</>
                                <br />
                                </>
                            )
                        })}
                    </div>
                    <div className="details-status plex">
                        <h4>Status:</h4>
                        {userFlight.status}
                    </div>
                </div>
            </div>

            <div className="workorder-map-label">
                <h3>Flight plan</h3>
            </div>
            <div className="workorder-map" ref={mapSize}>
                <FlightPlan
                    mode="view"
                    initialValues={userFlight.flight_plan}
                    updateWaypoints={() => {}}
                    reset={resetMapToggle}
                    flightData={userFlight.flight_data}
                />
                <p className="small-padding-top">
                    If completed, flight path is shown in red.
                </p>
            </div>

            <div className="workorder-nav">
                <button
                    onClick={() => {
                        history.goBack(-1)
                    }}
                    className=""
                >
                    Go Back
                </button>{' '}
                to work orders.
            </div>
        </div>
    )
}

export default WorkOrderDetails
