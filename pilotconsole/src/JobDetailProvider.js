import JobDetailContext from './JobDetailContext'
import Axios from 'axios'
import { useState, useEffect } from 'react'

const JobDetailProvider = ({ children }) => {

    let [activeJob, setActiveJob] = useState()
    let [flightPlan, setFlightPlan] = useState([])
    let [flightData, setFlightData] = useState([])
    
    
    const updateActiveJob = (newJob) => {
        //update active job ONLY IF an internet connection is available.
        setActiveJob(newJob)
        async function fetchFlight () {
            let flightById = await Axios(`/api/work_orders/work_order/${newJob}`)
            setFlightPlan(flightById.data.flight.flight_plan)
            console.log(flightById.data.flight.flight_plan)
        }
        fetchFlight()
        
    } 
    
    const updateFlightData = (completedflight) => {
        setFlightData(completedflight)
        console.log("Completed Flight Plan",completedflight)
    }
    
    
    function clearJob () {
        setActiveJob(null)
        setFlightPlan([])
        console.log('clearJob called')

    } 

    let contextValue = {
        clearJob,
        updateActiveJob,
        activeJob,
        flightPlan,
        updateFlightData,
        flightData

    }

    return (
        <JobDetailContext.Provider value={contextValue}>
            { children }
        </JobDetailContext.Provider>
    )
}

export default JobDetailProvider