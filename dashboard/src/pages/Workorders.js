import { useContext, useState } from 'react'

import AuthenticationContext from '../AuthenticationContext'
import React from 'react'
import Scheduling from '../components/Scheduling'
import WorkOrdersByClient from '../components/WorkOrdersByClient'
import accountTypeIcons from '../components/AccountTypeIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlusSquare,
    faMinusSquare
} from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom'
import Preview from '../components/Preview'

const Workorders = () => {
    const authContext = useContext(AuthenticationContext)
    const history = useHistory()
    const [jobStatusUpdated, setJobStatusUpdated] = useState(false)
    const [formToggle, setFormToggle] = useState(false)
    const [selectedJob, setSelectedJob] = useState()

    function statusUpdated() {
        console.log('status pre:', jobStatusUpdated)
        setJobStatusUpdated(!jobStatusUpdated)
        // setJobStatusUpdated(true)
        console.log('status post:', jobStatusUpdated)
    }

    return (
        <div className="customer-container">
            {/* <div className="header"> */}
            <div className="welcome-bar">
                <p>Welcome: {authContext.username}</p>
            </div>
            <div className="welcome-bar-secondary">
                {/* <p>Email: {authContext.email} ({authContext.accountType})</p> */}
                <p>
                    {/* User: */}
                    {accountTypeIcons()} {authContext.email}
                </p>
            </div>
            {/* </div> */}

            <div className="scheduling-interface">
                <button
                    className="big-button job-scheduling no-border"
                    onClick={() => {
                        setFormToggle(!formToggle)
                    }}
                >
                    {formToggle ? (
                        <>
                            <FontAwesomeIcon
                                icon={faMinusSquare}
                                className="icon"
                            />
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                className="icon"
                            />
                        </>
                    )}
                    Schedule a new job
                </button>
            </div>

            <div className="customer-workorder-preview">
                <Preview selectedJob={selectedJob} />
            </div>

            {formToggle && (
                <div className="customer-workorder-preview">
                    <Scheduling newJobAdded={statusUpdated} />
                </div>
            )}

            <div className="app-content-bottom">
                <div>
                    <h3>Work Order List</h3>
                    <WorkOrdersByClient
                        newOrder={jobStatusUpdated}
                        selectedJob={(job) => setSelectedJob(job)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Workorders
