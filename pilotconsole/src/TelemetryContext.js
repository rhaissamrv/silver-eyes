import React from 'react'

const TelemetryContext = React.createContext({
    telemetryUpdate: (telemetryData) => {},
    pitch:'' ,
    yaw:'' ,
    roll:'',
    altitude:'',
    battery:'',
    speedX:'' ,
    speedY:'' ,
    speedZ:'' ,
    accelerationX:'',
    accelerationY:'' ,
    accelerationZ:'' ,
    timeOfFlightDistance:'',
    lowTemp:'',
    highTemp:'',
    motorRunTime:'',
    setDroneStatus:() => {},
    droneStatus:''

})

export default TelemetryContext