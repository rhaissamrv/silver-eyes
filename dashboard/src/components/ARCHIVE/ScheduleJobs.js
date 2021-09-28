// import RegistrationForm from './Forms/FormikTut'
import Scheduling from './Scheduling'
// import ResetButton from './Forms/ResetButton'
// import SubmitButton from './Forms/SubmitButton'
import { useState } from 'react'

function ScheduleJobs(props) {
    const [form, setForm] = useState(props)
    const [workTitle, setWorkTitle] = useState(props.title)
    const [workNumber, setWorkNumber] = useState(props.number)
    const [workDetails, setWorkDetails] = useState(props.details)
    const [workDate, setWorkDate] = useState(props.date)

    function submitClicked() {
        console.log('Scheduling a new work order')
        let newWorkOrder = {
            title: workTitle,
            number: workNumber,
            details: workDetails,
            date: workDate
        }
        setForm(newWorkOrder)
        props.newJobAdded()
        console.log('work order created:', newWorkOrder)
    }

    const onInputChange = (event, setFunction) => {
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value)
    }

    return (
        <div>
            <h3>Schedule a Flight</h3>
            <Scheduling />
        </div>
    )
}

export default ScheduleJobs
