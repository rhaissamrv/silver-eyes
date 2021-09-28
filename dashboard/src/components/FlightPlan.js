import { Map, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import './FlightPlan.css'
import iconMarker from '../assets/pin.png'
import deleteIcon from '../assets/delete.png'

const FlightPlan = ({
    updateWaypoints,
    mode,
    initialValues = [],
    reset,
    flightData = []
}) => {
    /* props notes:  if mode = write, then way points can be updated.  if mode = view, waypoints cannot be updated */

    const [markers, setMarkers] = useState(initialValues)
    //    const mapRef = useRef()

    //default center of Calgary
    const [defaultCenter, setDefaultCenter] = useState([
        Number(51.0511),
        Number(-114.08529)
    ])

    useEffect(() => {
        /*watch prop(reset).  If it is set to true, clear markers */
        if (reset.current === true) {
            resetMarkers()
            reset.current = false
        }
        console.log('reset called')
    }, [reset.current])

    //useEffect(()=>{
    //     // // if viewing a flight plan with established points, center map on the first waypoint
    //     // // else, locate the user and center the map on their position
    //     // if (markers.length ===0) {
    //     //   const {current={}}=mapRef  // allows grabbing the leaflet element
    //     //   const {leafletElement: map} = current
    //     //   //if location is found, the map will center on this location for initial rendering
    //     //   map.locate({
    //     //     setView: true,
    //     //     setZoom: true
    //     //   })
    //     // }
    //     //   //send the updated way points to the parent component
    //    updateWaypoints(markers)
    //},[markers])

    useEffect(() => {
        setMarkers(initialValues)
        if (initialValues.length !== 0) {
            setDefaultCenter([initialValues[0].lat, initialValues[0].lng])
            console.log([initialValues[0].lat, initialValues[0].lng])
        }
    }, [initialValues])

    // set up custom 'pin' type marker for flight path
    const markerIcon = L.icon({
        iconSize: [30, 30],
        //iconAnchor: [10, 41],
        //popupAnchor: [2, -40],
        iconUrl: iconMarker
    })

    function addMarker(e) {
        setMarkers([...markers, e.latlng])
        updateWaypoints([...markers, e.latlng])
    }

    // if markers are dragged to another location, update the marker array with the new coordinates
    function updateMarker(e) {
        let updatedMarkers = [...markers]
        updatedMarkers[e.target.options.markerIndex] = e.target._latlng
        setMarkers(updatedMarkers)
        updateWaypoints(updatedMarkers)
    }

    function deleteMarker(index) {
        let updatedMarkers = [...markers]
        updatedMarkers.splice(index, 1)
        setMarkers(updatedMarkers)
        updateWaypoints(updatedMarkers)
    }

    //allows user to reset and clear all markers
    function resetMarkers() {
        setMarkers([])
        updateWaypoints([])
    }

    // Some mapping options

    // topographical map
    //const URL1 = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    //const attribution1 = 'Tiles &copy; Esri'

    // airport data
    const URL2 =
        'http://2.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{-y}.png'
    const attribution2 =
        '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)'

    //satellite with streets
    const URL3 =
        'https://api.mapbox.com/styles/v1/pstorres/cks70fjex09x617pnci9ccpq3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHN0b3JyZXMiLCJhIjoiY2tzNnkzaHZ4MDRwbjJ3bm9jNG9vOXVuOCJ9.D77_DIhMPf7gCDFAL4bJAg'
    const attribution3 = 'Tiles &copy; Mapbox'

    return (
        <div className="map-container">
            <div id="mapid" className="map">
                <Map
                    center={defaultCenter}
                    zoom={18}
                    scrollWheelZoom={false}
                    onClick={
                        mode === 'view'
                            ? () => {}
                            : (e) => {
                                  addMarker(e)
                              }
                    }
                    className="leaflet-embiggened"
                >
                    {/*<TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />*/}
                    <TileLayer attribution={attribution3} url={URL3} />
                    <TileLayer attribution={attribution2} url={URL2} />

                    {/*<TileLayer
                    attribution={attribution1}
                    url={URL1}
                />*/}

                    {/* if view mode, do not allow updates to map. */}
                    {markers.map((markers, index) => (
                        <Marker
                            icon={markerIcon}
                            markerIndex={index}
                            key={index}
                            draggable={mode === 'view' ? false : true}
                            onDragend={(e) => updateMarker(e)}
                            position={[
                                Number(markers.lat),
                                Number(markers.lng)
                            ]}
                        >
                            <Tooltip> Location {index + 1}</Tooltip>
                        </Marker>
                    ))}

                    {/* if view mode and flight data is available, show path on map*/}
                    {mode === 'view' && flightData.length !== 0 && (
                        <Polyline positions={flightData} color={'red'} />
                    )}
                </Map>

                {/* list of coordinates of the markers and delete icon */}
                {markers.map((markers, index) => (
                    // only show X (delete icon) if NOT in view mode
                    <div className="coodinates-single">
                        {' '}
                        {mode === 'write' && (
                            <img
                                className="delete-button"
                                key={index}
                                src={deleteIcon}
                                alt="X"
                                onClick={() => deleteMarker(index)}
                            />
                        )}
                        #{index + 1}, Latitude:{' '}
                        {Number(markers.lat).toString().slice(0, 7)}
                        ,&nbsp;Longitude:{' '}
                        {Number(markers.lng).toString().slice(0, 9)}
                    </div>
                ))}

                {/* if view mode, do not allow updates to map, thus do not show instructions */}
                {mode === 'view' ? (
                    <></>
                ) : (
                    <div className="map-instructions">
                        <p>
                            <h3>Flight Path Instructions:</h3>
                            <br />
                            Click on map to add new waypoints. Markers can be
                            dragged to new location if required. Delete
                            unnecessary waypoints by clicking on 'X' icon in
                            list.
                        </p>
                        <button
                            onClick={resetMarkers}
                            type={'button'}
                            className="space-before cancel"
                        >
                            Clear all waypoints from map
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FlightPlan
