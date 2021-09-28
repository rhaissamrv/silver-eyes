import './WorkOrdersByClient.css'

import React, { useContext, useEffect, useState, useMemo } from 'react'

import AuthenticationContext from '../AuthenticationContext'
import TableContainer, { SelectColumnFilter } from './TableContainer.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const WorkOrdersByClient = ({ newOrder, selectedJob }) => {
    const [userFlights, setUserFlights] = useState([])
    const authContext = useContext(AuthenticationContext)

    useEffect(() => {
        const fetchFlights = async () => {
            // console.log("UserName:", authContext.username);
            let flightsByUser = await fetch(
                `/api/work_orders/${authContext.username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            let responseData = await flightsByUser.json()
            //   console.log("responseData:", responseData);
            setUserFlights(responseData.flights)
        }
        fetchFlights()
        // }, [authContext.username])
    }, [newOrder])

    console.log('userFlights:', userFlights)

    const columns = useMemo(
        () => [
            {   
                Header: 'Job Number', 
                accessor: 'jobNumber',
                Cell: ({cell,row}) => {
                    const { value } = cell
                    return (
                        <>
                            <div>
                                <button className="no-border" onClick={()=>selectedJob(row.original._id)}>
                                    {value}
                                </button>
                            </div>
                        </>
                    )
                }
            },    
            {
                Header: 'Pilot',
                accessor: 'pilot',
                Cell: ({ cell }) => {
                    const { value } = cell
                    if (!value) {return <i>Assignment Pending</i>}
                    else
                    return (
                        <>
                            {value} 
                            <a href={`/pilot/${value}`}> 
                            <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="icon"
                            />
                                Info 
                            </a>
                        </>
                    )
                }
            },
            { Header: 'Flight Date', accessor: 'date',
            Cell: ({cell})=>{
                const {value} = cell
                let date = new Date(value)
                let formattedDate= date.toDateString()
                if (!value) return null
                return (
                    <> 
                    {formattedDate}
                    </>
                )
            }
            },
            { Header: 'Flight Time', accessor: 'time',
                Cell: ({cell})=>{
                    const {value} = cell
                    let date = new Date(value)
                    let formattedTime= date.toLocaleTimeString()
                    if (!value) return null
                    return (
                        <> 
                        {formattedTime}
                        </>
                    )
                }   
            },

            { Header: 'Client Contact', accessor: 'clientContact' },
            { Header: 'Client Email', accessor: 'clientEmail' },
            {
                Header: 'Work Order Details',
                accessor: '_id',
                Cell: ({ cell }) => {
                    const { value } = cell
                    if (!value) return null
                    return (
                        <>
                            {value.slice(0, 8)}
                            <a href={`/workorders/${value}`}>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="icon"
                                />
                                Details
                            </a>
                        </>
                    )
                }
            },
            { Header: 'Job Description', accessor: 'jobDetails'},
            {
                Header: 'Status',
                accessor: 'status',
                Filter: SelectColumnFilter,
                filter: 'equals'
            }
        ],
        []
    )

    if (userFlights.length === 0)
        return <p>There are no previous flights for this user</p>

    return <TableContainer columns={columns} data={userFlights} selectedJob={(job)=>selectedJob(job)} />
}

export default WorkOrdersByClient
