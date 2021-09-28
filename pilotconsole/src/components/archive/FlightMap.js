import * as Yup from 'yup'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'
import React, { useContext, useRef, useState } from 'react'

// import "bootstrap/dist/css/bootstrap.css"
import TelemetryContext from '../TelemetryContext'

// Drone needs to be faced north intially
// Forward is +X speed (North)
// Backward is -X speed (South)
// Right is +Y speed (East)
// Left is -Y speed (West)

const GOOGLE_MAP_API_KEY = 'AIzaSyBFgIt5Npu-UYGGWtRLSSZA4jF5vJw3yFo'

const FlightMap = () => {
    const telemetryContext = useContext(TelemetryContext)
    // reference variables (do not cause re-render)
    let initialLat = useRef(0)
    let initialLng = useRef(0)

    let positionLat = useRef(0)
    let positionLong = useRef(0)

    let timerID = useRef(null)

    let newDistance = 0
    let newBearing = 0

    //how often the speed is polled.  Time is in ms.
    const recordingInterval = 500

    const [centerLat, setCenterLat] = useState(0)
    const [centerLng, setCenterLng] = useState(0)
    const [coordinates, setCoordinates] = useState([])
    const [recording, setRecording] = useState(false)

    let currentXSpeed = useRef(0)
    let currentYSpeed = useRef(0)

    currentXSpeed.current = telemetryContext.speedX
    currentYSpeed.current = telemetryContext.speedY

    // updates the positionLat, positionLong from input fields in formik form or getStartCoordinatesfromGoogle
    function updateStartCoordinates(lat, lng) {
        initialLat.current = lat
        initialLng.current = lng
        positionLat.current = lat
        positionLong.current = lng
        setCenterLat(lat)
        setCenterLng(lng)
        // update coordinate array with new coordinates
        setCoordinates((coordinates) => [
            { lat: Number(lat), lng: Number(lng) }
        ])
    }

    function calculateDistanceAndBearing(NS_Distance, EW_Distance) {
        // NS_Distance is north-south distance.  X speed is in north direction, -X speed is in the south direction

        // distance is based on the NS, EW vector speeds, multiplied by the time to traverse the distance
        let distance =
            (Math.sqrt(Math.pow(NS_Distance, 2) + Math.pow(EW_Distance, 2)) *
                recordingInterval) /
            1000
        // Math.atan2(y/x) in cartesian coordinates
        let angle = Math.atan2(NS_Distance, EW_Distance) * (180 / Math.PI)
        // If value is in the 4th quadrant of the cartesian plane, bearing is 270+180-angle, otherwise bearing is 90 - angle
        let bearing =
            NS_Distance >= 0 && EW_Distance < 0 ? 450 - angle : 90 - angle

        console.log('distance in function', distance)
        console.log('angle in function', angle)
        console.log('bearing in function', bearing)
        newDistance = distance
        newBearing = bearing
    }

    function getNewCoordinates() {
        // using haversine formula for determining second set of lat and long
        // distance travelled in x plane = speed cm/s * flight time (1s)
        // https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/

        // Earth radius (in km)
        const radius = 6378

        // convert latitude/longitude degrees to radians
        console.log('latA is', positionLat.current)
        console.log('longA is', positionLong.current)

        const latA = positionLat.current * (Math.PI / 180)
        const longA = positionLong.current * (Math.PI / 180)
        const bearing = newBearing * (Math.PI / 180)

        // convert distance from drone from cm to km
        //**NOTE:  Due to the small scale of movement, this function pretends that a cm is actually a meter.  Otherwise the scale is too small to render on the google map
        let distance = newDistance / 1000
        console.log('distance in km', distance)

        let latB = Math.asin(
            Math.sin(latA) * Math.cos(distance / radius) +
                Math.cos(latA) * Math.sin(distance / radius) * Math.cos(bearing)
        )
        let longB =
            longA +
            Math.atan2(
                Math.sin(bearing) *
                    Math.sin(distance / radius) *
                    Math.cos(latA),
                Math.cos(distance / radius) - Math.sin(latA) * Math.sin(latB)
            )

        // convert back to degrees
        let latBdegrees = latB * (180 / Math.PI)
        let longBdegrees = longB * (180 / Math.PI)

        // round to 4 decimal places
        latBdegrees = Math.round(latBdegrees * 100000) / 100000
        longBdegrees = Math.round(longBdegrees * 100000) / 100000

        console.log('latBdegrees in getCoordinates', latBdegrees)
        console.log('longBdegrees in getCoordinates', longBdegrees)

        // update coordinate array with new coordinates
        setCoordinates((coordinates) => [
            ...coordinates,
            { lat: Number(latBdegrees), lng: Number(longBdegrees) }
        ])
        positionLat.current = latBdegrees
        positionLong.current = longBdegrees
        // return array with new coordinates

        console.log('latB, longB', { latBdegrees, longBdegrees })
        console.log('coordinates in function', coordinates)
    }

    const mapStyles = {
        height: '300px',
        width: '100%'
    }

    const defaultCenter = {
        lat: Number(centerLat),
        lng: Number(centerLng)
    }

    function startRecording() {
        console.log('Recording has started')

        function doCalculations() {
            //only update array if the drone is moving
            if (currentXSpeed.current === 0 && currentYSpeed.current === 0)
                return

            console.log('currentspeedX', currentXSpeed.current)
            console.log('currentspeedY', currentYSpeed.current)
            calculateDistanceAndBearing(
                currentXSpeed.current,
                currentYSpeed.current
            )
            getNewCoordinates()
        }

        timerID.current = setInterval(doCalculations, recordingInterval)
    }

    const handleClearRecording = () =>
        updateStartCoordinates(initialLat.current, initialLng.current)

    return (
        <div>
            <div className="position-query">
                <Formik
                    initialValues={{ lat: '', lng: '' }}
                    // validates against the validation schema defined as Yup Object

                    validationSchema={Yup.object({
                        latitude: Yup.number().required('Value is Required'),
                        longitude: Yup.number().required('Value is Required')
                    })}
                    onSubmit={async (values) => {
                        // on submission of form, set the values of intial latitude and longitude
                        updateStartCoordinates(
                            Number(values.latitude),
                            Number(values.longitude)
                        )
                    }}
                >
                    {/* touched object = true if field has been visited.  errors stores the all validation errros */}
                    {({ errors, touched }) => (
                        <Form className="form-initial-location">
                            <div className="form-group">
                                <div className="col-md">
                                    <label htmlFor="latitude">
                                        Enter starting latitude coordinate in
                                        degrees
                                    </label>
                                    <Field
                                        type="text"
                                        name="latitude"
                                        placeholder="Enter latitude coordinate in degrees"
                                        className={`form-control ${
                                            touched.latitude && errors.latitude
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="latitude"
                                        className="invalid-feedback"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-md">
                                    <label htmlFor="longitude">
                                        Enter starting longitude coordinate in
                                        degrees:
                                    </label>
                                    <Field
                                        type="text"
                                        name="longitude"
                                        placeholder="Enter longitude in degrees"
                                        className={`form-control ${
                                            touched.longitude &&
                                            errors.longitude
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="longitude"
                                        className="invalid-feedback"
                                    />
                                </div>
                            </div>

                            <br />
                            <button type="submit" className="">
                                {' '}
                                Submit{' '}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p>Current latitude: {positionLat.current}</p>
                <p>Current longtitude: {positionLong.current}</p>

                {!recording && (
                    <button
                        onClick={() => {
                            startRecording(
                                telemetryContext.accelerationX,
                                telemetryContext.accelerationY
                            )
                            setRecording(true)
                        }}
                    >
                        Start flight recording
                    </button>
                )}
                {recording && <button> Recording…</button>}

                <button
                    onClick={() => {
                        clearInterval(timerID.current)
                        console.log('recording stopped')
                        setRecording(false)
                    }}
                >
                    {' '}
                    Stop flight recording
                </button>

                <button onClick={handleClearRecording}>
                    Clear flight recording
                </button>
            </div>

            <div className="position-map">
                <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={18}
                        defaultCenter={defaultCenter}
                        center={{
                            lat: positionLat.current,
                            lng: positionLong.current
                        }}
                    >
                        <Marker label="YOU ARE HERE" position={defaultCenter} />

                        <Polyline
                            path={coordinates}
                            options={{
                                strokeColor: '#00ffff',
                                strokeOpacity: 1,
                                strokeWeight: 2
                            }}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    )
}

export default FlightMap
