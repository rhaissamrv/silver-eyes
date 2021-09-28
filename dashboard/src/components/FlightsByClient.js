import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

const FlightsByClient = ({ user }) => {
    const [userFlights, setUserFlights] = useState([])
    const { userInfo } = useParams()

    useEffect(() => {
        const fetchFlights = async () => {
            let flightsByUser = await fetch('/api/work_orders/' + user, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let responseData = await flightsByUser.json()
            console.log('responseData:', responseData)
            setUserFlights(responseData.flights)
        }
        fetchFlights()
    }, [user])

    return (
        <div>
            {/* <div className="main-div"> */}
            <div className="flights-by-user-wrap-div">
                {userFlights.map((flight) => {
                    return (
                        <div>
                            <div>Date: {flight.date}</div>
                            <div>Pilot: {flight.pilot}</div>
                            <div>Flight Time: {flight.time}</div>
                            <div>Flight Plan: {flight.flight_plan}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FlightsByClient
