import Axios from 'axios'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './ConfirmModal_custom.css' // Import custom css for the confirm modal

const UpdateWorkOrderStatus = ({
    currentStatus,
    workOrderID,
    handleChildUpdated
}) => {
    const [status, setStatus] = useState(currentStatus)

    const handleSubmit = async (value) => {
        let statusUpdate

        /* DELETE STATUS */
        if (value === 'Delete') {
            //complete modal before continuing
            async function modalAlert() {
                confirmAlert({
                    closeOnClickOutside: false,

                    customUI: ({ onClose }) => {
                        return (
                            <div className="confirm-modal-container">
                                <div className="confirm-modal-header">
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="icon"
                                    />
                                    Confirm Deletion
                                </div>

                                <p>
                                    Deleting work order cannot be undone, and
                                    all data within the work order will be lost.
                                </p>

                                <div className="confirm-modal-button-group">
                                    <button
                                        className="featured"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await deleteWorkOrder()
                                            //document.location.reload()
                                            onClose()
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    }
                })
            }
            await modalAlert()

            // //pop-up modal to confirm deletion
            async function deleteWorkOrder() {
                console.log('I am deleting')

                try {
                    statusUpdate = await Axios({
                        method: 'DELETE',
                        withCredentials: true,
                        url: `http://localhost:3001/api/work_orders/work_order/${workOrderID}/delete`
                    })
                    console.log(statusUpdate)
                } catch (err) {
                    console.log('Error:', err)
                }
                handleChildUpdated()
            }
        } else {
            /* ALL OTHER STATUS UPDATES */
            try {
                statusUpdate = await Axios({
                    method: 'PATCH',
                    data: { status: value },
                    withCredentials: true,
                    url: `http://localhost:3001/api/work_orders/work_order/${workOrderID}`
                })
                console.log(statusUpdate)
            } catch (err) {
                console.log('Error:', err)
            }
            console.log('Updated status sent to database')
        }

        handleChildUpdated()
    }

    return (
        <div>
            <select
                className="table-select dropdown select-simplified-style"
                value={status}
                onChange={(event) => {
                    setStatus(event.target.value)
                    handleSubmit(event.target.value)
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <option selected disabled>
                    --Select--
                </option>
                <option disabled value={'Requested'}>
                    Requested
                </option>
                <option value={'Pending'}>Pending</option>
                <option value={'Completed'}>Completed</option>
                <option value={'Cancelled'}>Cancelled</option>
                <option value={'Delete'}>Delete</option>
            </select>
        </div>
    )
}
export default UpdateWorkOrderStatus
