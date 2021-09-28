import AuthenticationContext from '../AuthenticationContext'
import React from 'react'
import WorkOrdersAdmin from '../components/WorkOrdersAdmin'
import { useContext, useState, useEffect } from 'react'
import accountTypeIcons from '../components/AccountTypeIcons'
import Preview from '../components/Preview'
import {
    faExclamationCircle,
    faClock,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Adminpage = () => {
    const authContext = useContext(AuthenticationContext)
    const [selectedJob, setSelectedJob] = useState()
    const [userFlights, setUserFlights] = useState()
    const [tableUpdated, setTableUpdated] = useState(false)

    useEffect(() => {
        const fetchFlights = async () => {
            let flightsByUser = await fetch(`/api/work_orders/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let responseData = await flightsByUser.json()
            setUserFlights(responseData.flights)
        }
        fetchFlights()
    }, [tableUpdated])

    const handleTableUpdated = () => {
        setTableUpdated(!tableUpdated)
        console.log('childUpdated')
    }

    if (!userFlights) return null

    const flightStats = () => {
        let numberRequested = 0
        let numberCompleted = 0
        let numberPending = 0

        userFlights.forEach((flight) => {
            console.log(flight)
            if (flight.status === 'Requested') numberRequested++
            if (flight.status === 'Completed') numberCompleted++
            if (flight.status === 'Pending') numberPending++
        })

        return [numberRequested, numberPending, numberCompleted]
    }

    let jobNumbers = flightStats()

    return (
        <div className="customer-container">
            {/* <div className="header"> */}
            <div className="welcome-bar">
                <p>Welcome: {authContext.username}</p>
            </div>
            <div className="welcome-bar-secondary">
                <p>
                    {/* User: */}
                    {accountTypeIcons()} {authContext.email}
                </p>
            </div>

            <div className="customer-workorder-alerts">
                <h3>Notices:</h3>

                <div className="status-card">
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="status-card-icon"
                    />
                    <br />
                    Require Pilot Assignment
                    <p><strong>{jobNumbers[0]}</strong></p>
                </div>

                <div className="status-card">
                    <FontAwesomeIcon
                        icon={faClock}
                        className="status-card-icon"
                    />
                    <br />
                    Pending Jobs
                    <p><strong>{jobNumbers[1]}</strong></p>
                </div>

                <div className="status-card">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="status-card-icon"
                        size="5"
                    />
                    <br />
                    Completed Jobs
                    <p><strong>{jobNumbers[2]}</strong></p>
                </div>
            </div>

            <div className="customer-workorder-preview">
                <Preview selectedJob={selectedJob} />
            </div>

            <div className="app-content-bottom">
                <div>
                    <h3>Work Order List</h3>
                    <WorkOrdersAdmin
                        selectedJob={(job) => setSelectedJob(job)}
                        handleTableUpdated={handleTableUpdated}
                    />
                </div>
            </div>
        </div>
    )
}

export default Adminpage
