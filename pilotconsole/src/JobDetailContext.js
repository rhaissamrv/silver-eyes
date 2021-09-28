import React from 'react'

const JobDetailContext = React.createContext({
    clearJob: () => {},
    updateActiveJob: (newJob) => {},
    activeJob:'',
    flightPlan:[],
    updateFlightData:(filename)=>{},
    flightData:[]
})

export default JobDetailContext