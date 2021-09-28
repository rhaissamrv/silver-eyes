import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import JobDetailContext from '../JobDetailContext'
import FlightMap from '../components/FlightMap_Leaflet'
import logowide from '../assets/brand/black/silvereyes_sm_square_wide_b.svg'

import './FlightReport.css'
// import VideoUploadForm from "./VideoUploadForm"
import Axios from 'axios'

const FlightReport = ({ onSave, flight }) => {
    const jobContext = useContext(JobDetailContext)
    const history = useHistory()

    // useState for videoUpload input
    const [fileInput, setFileInput] = useState()
    const [videoName, setVideoName] = useState()
    const [isUploading, setIsUpoading] = useState(false)

    // useState for other inputs
    const [insertedFlightPlan, setInsertedFlightPlan] = useState(
        flight.flight_plan
    )
    const [insertedFlightData, setInsertedFlightData] = useState(
        flight.flight_data
    )
    const [insertedStatus, setInsertedStatus] = useState(flight.status)
    const [insertedJobTitle, setInsertedJobTitle] = useState(flight.jobTitle)
    const [insertedJobNumber, setInsertedJobNumber] = useState(flight.jobNumber)
    const [insertedJobDetails, setInsertedJobDetails] = useState(
        flight.jobDetails
    )
    const [insertedClientContact, setInsertedClientContact] = useState(
        flight.clientContact
    )
    const [insertedClientEmail, setInsertedClientEmail] = useState(
        flight.clientEmail
    )
    const [insertedCustomerName, setInsertedCustomerName] = useState(
        flight.customerName
    )

    useEffect(() => {
        // get flight_data from jobContext only if it's not an empty array, otherwise it will delete some info we might have in database
        if (jobContext.flightData.length !== 0) {
            setInsertedFlightData(jobContext.flightData)
        }
    }, [])

    // select a video file when choose file button is clicked
    const videoUpload = async (e) => {
        const file = e.target.files[0]
        console.log('file:', file)
        const fileName = encodeURIComponent(file.name)
        console.log('fileName:', fileName)
        setFileInput(file)
        setVideoName(fileName)
    }

    // variables that will be reassigned inside onSaveClicked function
    let awsResponse
    let dbResponse
    let editedFlight

    //function to submit the report
    const onSaveClicked = async () => {
        console.log('Create has been clicked!')
        setIsUpoading(true)

        // flight updated
        editedFlight = {
            flight_plan: insertedFlightPlan,
            flight_data: insertedFlightData,
            status: insertedStatus,
            jobTitle: insertedJobTitle,
            jobNumber: insertedJobNumber,
            jobDetails: insertedJobDetails,
            clientContact: insertedClientContact,
            clientEmail: insertedClientEmail,
            customerName: insertedCustomerName
        }

        // console.log("Editing flight", editedFlight);
        await onSave(editedFlight)

        // send a request to the server and upload the video to AWS
        const formData = new FormData()

        formData.append('file', fileInput)
        try {
            const upload = await Axios({
                method: 'POST',
                url: 'http://localhost:3001/api/aws/upload_video',
                data: formData
            })

            console.log('upload:', upload)
            awsResponse = upload.statusText
        } catch (err) {
            console.log('Error:', err)
        }

        // send a request to the server and upload the video URL to mongodb
        let videoFilenameUpdate
        try {
            videoFilenameUpdate = await Axios({
                method: 'PATCH',
                data: {
                    videoURL: `http://localhost:3001/api/aws/download_video/${videoName}`
                    //videoURL: `https://rmrvbucket.s3.us-east-2.amazonaws.com/${videoName}`,
                },
                withCredentials: true,
                url: `http://localhost:3001/api/work_orders/work_order/${jobContext.activeJob}`
            })
            console.log(videoFilenameUpdate)
            dbResponse = videoFilenameUpdate.statusText
        } catch (err) {
            console.log('Error:', err)
        }

        // to inform the pilot if the video was uploaded to AWS and the URL stored in the DB
        if (awsResponse === 'OK' && dbResponse === 'OK') {
            alert('Your video has been uploaded')
        } else {
            alert("Sorry, we couldn't your video, please try again later")
        }
        setIsUpoading(false)
        history.push('/pilotconsole')
    }

    // Set a new state when the user type something
    const onInputChange = (event, setFunction) => {
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value)
    }

    if (flight && jobContext.activeJob) {
        return (
            <div className="fightreport-container">
                <div className="report-header">
                    <div className="report-logo inline">
                        <img
                            class="logo"
                            src={logowide}
                            alt="silvereyes"
                            height="28px"
                        ></img>
                    </div>
                    <div className="report-title inline">
                        <h4>Flight Report</h4>
                    </div>
                </div>
                <div className="flight-form">
                    <div className="form-1-form-2">
                        <div className="form-1">
                            <div className="section-label">
                                <label>Client Information</label>
                            </div>
                            <div className="form-1-form-2-individual">
                                <label htmlFor="customerName">Name</label>
                                <input
                                    value={insertedCustomerName}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="form-1-form-2-individual inline-half">
                                <label htmlFor="clientEmail">E-mail</label>
                                <input
                                    value={insertedClientEmail}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="form-1-form-2-individual inline-half">
                                <label htmlFor="clientContact">
                                    Contact Number
                                </label>
                                <input
                                    value={insertedClientContact}
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-2">
                            <div className="section-label-2">
                                <label>Job Information</label>
                            </div>
                            <div className="form-1-form-2-individual">
                                <label htmlFor="jobTitle">Job Title</label>
                                <input
                                    value={insertedJobTitle}
                                    type="text"
                                    onChange={(event) =>
                                        onInputChange(
                                            event,
                                            setInsertedJobTitle
                                        )
                                    }
                                />
                            </div>
                            <div className="form-1-form-2-individual inline-half">
                                <label htmlFor="jobNumber">Job Number</label>
                                <input
                                    value={insertedJobNumber}
                                    type="text"
                                    onChange={(event) =>
                                        onInputChange(
                                            event,
                                            setInsertedJobNumber
                                        )
                                    }
                                />
                            </div>
                            <div className="form-1-form-2-individual inline-half">
                                <label>Job Status</label>
                                <select
                                    value={insertedStatus}
                                    onChange={(event) =>
                                        onInputChange(event, setInsertedStatus)
                                    }
                                >
                                    <option disabled> Select one option</option>
                                    <option value={'Pending'}>Pending</option>
                                    <option value={'Completed'}>
                                        Completed
                                    </option>
                                </select>
                            </div>
                            <div className="form-1-form-2-individual full job-details-container">
                                <label htmlFor="jobDetails">Job Details</label>
                                <textarea
                                    value={insertedJobDetails}
                                    type="text"
                                    onChange={(event) =>
                                        onInputChange(
                                            event,
                                            setInsertedJobDetails
                                        )
                                    }
                                    className="pilot-text-area"
                                />
                            </div>
                            <div className="videoUpload">
                                <label htmlFor="video-upload">
                                    Upload Video
                                </label>
                                {isUploading && <p> uploading video...</p>}
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    // accept="image/*"
                                    onChange={videoUpload} /*  */
                                />
                                {/* <VideoUploadForm /> */}
                            </div>
                        </div>
                    </div>
                    <div className="form-3-form-4">
                        <div className="form-3">
                            <div className="section-label">
                                <label>Flight Plan</label>
                            </div>
                            {insertedFlightPlan.map((i) => {
                                return (
                                    <div className="individual-flight-plan ">
                                        <label>Latitude</label>
                                        <input
                                            value={i.lat}
                                            type="text"
                                            onChange={(event) =>
                                                onInputChange(
                                                    event,
                                                    setInsertedFlightPlan
                                                )
                                            }
                                        />
                                        <label>Longitude</label>
                                        <input
                                            value={i.lng}
                                            type="text"
                                            onChange={(event) =>
                                                onInputChange(
                                                    event,
                                                    setInsertedFlightPlan
                                                )
                                            }
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="form-4">
                            <FlightMap />
                        </div>
                    </div>
                </div>
                <div className="form-input-btn">
                    <button
                        className="cancel"
                        onClick={() => {
                            history.push('/pilotconsole')
                        }}
                    >
                        Back to Pilot Console
                    </button>
                    <button onClick={onSaveClicked}>Submit Report</button>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default FlightReport
