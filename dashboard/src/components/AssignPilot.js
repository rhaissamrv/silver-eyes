import './Defaults.css'
import Axios from 'axios'
import { useState } from 'react'

const AssignPilot = ({
    currentPilot,
    pilotList,
    workOrderID,
    handleChildUpdated
}) => {
    const [pilot, setPilot] = useState(currentPilot)

    const handleSubmit = async (value) => {
        let pilotUpdate
        try {
            pilotUpdate = await Axios({
                method: 'PATCH',
                data: { pilot: value, status: 'Pending' },
                withCredentials: true,
                url: `http://localhost:3001/api/work_orders/work_order/${workOrderID}`
            })
            console.log(pilotUpdate)
        } catch (err) {
            console.log('Error:', err)
        }
        console.log('new pilot sent to database')
        handleChildUpdated()
    }

    return (
        <div>
            <select
                className="table-select dropdown select-simplified-style"
                value={pilot}
                onChange={(event) => {
                    setPilot(event.target.value)
                    handleSubmit(event.target.value)
                }}
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                <option selected disabled>
                    --Select--
                </option>
                {pilotList.map((pilot) => (
                    <option value={pilot.username}> {pilot.username} </option>
                ))}
            </select>
        </div>
    )
}

export default AssignPilot
