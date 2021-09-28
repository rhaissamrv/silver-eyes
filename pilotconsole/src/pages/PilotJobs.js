import { useEffect, useState, useContext } from 'react'
import Axios from 'axios'
import AuthenticationContext from '../AuthenticationContext'
import JobDetailContext from '../JobDetailContext'
import './PilotJobs.css'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'

const PilotJobs = () => {
    const history = useHistory()
    const authContext = useContext(AuthenticationContext)
    const jobContext = useContext(JobDetailContext)

    const [jobData, setJobData] = useState([])
    const [networkAvailable, setNetworkAvailable] = useState(true)

    useEffect(() => {
        console.log(authContext)
        const getAllPilotJobs = async () => {
            let jobsForPilot
            try {
                jobsForPilot = await Axios(
                    `/api/work_orders/pilot/${authContext.username}`
                )
                //jobsForPilot = await Axios(`/api/work_orders/pilot/${authContext.userID}`)
            } catch (error) {
                if (error.request) {
                    setNetworkAvailable(false)
                }
            }
            if (jobsForPilot) {
                let responseData = await jobsForPilot.data.flights
                setJobData(responseData)
            }
        }
        getAllPilotJobs()
    }, [])

    return (
        <div className="pilot-jobs-container">
            <div className="pilot-jobs-header">
                <Header />
            </div>

            <div className="pilot-jobs-table">
                <div className="table-header">
                    <h5>Assigned jobs:</h5>
                    <h6>Select job to load into pilot console:</h6>
                </div>

                <div className="table-pilot-job-header">
                    <div className="table-column-1">Job Number</div>
                    <div className="table-column-2">Job Description</div>
                    <div className="table-column-3">Client Name</div>
                    <div className="table-column-4">Client Contact</div>
                    <div className="table-column-5">Client Email</div>
                    <div className="table-column-6">Date</div>
                    <div className="table-column-7">Time</div>
                    <div className="table-column-8">Job Status</div>
                </div>

                {networkAvailable && (
                    <div className="table-body">
                        {jobData.map((jobData) => {
                            let date = new Date(jobData.date)
                            return (
                                <div
                                    key={jobData._id}
                                    onClick={() => {
                                        jobContext.updateActiveJob(jobData._id)
                                        history.push('/pilotconsole')
                                    }}
                                >
                                    <div className="table-pilot-job-item">
                                        <div className="table-column-1">
                                            {jobData.jobNumber}
                                        </div>
                                        <div className="table-column-2">
                                            {jobData.jobDetails}
                                        </div>
                                        <div className="table-column-3">
                                            {jobData.customerName}
                                        </div>
                                        <div className="table-column-4">
                                            {jobData.clientContact}
                                        </div>
                                        <div className="table-column-5">
                                            {jobData.clientEmail}
                                        </div>
                                        <div className="table-column-6">
                                            {date.toDateString()}
                                        </div>
                                        <div className="table-column-7">
                                            {date.toLocaleTimeString()}
                                        </div>
                                        <div className="table-column-8">
                                            {jobData.status}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {!networkAvailable && (
                    <div className="table-no-content">
                        {' '}
                        Network Unavailable. Jobs cannot be accessed at this
                        time{' '}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PilotJobs
