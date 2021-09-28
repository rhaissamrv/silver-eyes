// import 'bootstrap/dist/css/bootstrap.css'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import './FlightControls.css'

import React, { useEffect, useState } from 'react'

import RangeSlider from 'react-bootstrap-range-slider'
import useKeyPress from '../hooks/useKeyPress'

const FlightControls = ({ DroneConnection }) => {
    const [controlSensitivity, setControlSensitivity] = useState(20)
    const [rotationSensitivity, setRotationSensitivity] = useState(5)
    const [speedSetting, setSpeedSetting] = useState(10)

    const droneIP = '192.168.10.1'
    const commandPORT = 8889

    const sendCommand = (droneCommand) => {
        DroneConnection.send(
            droneCommand,
            0,
            droneCommand.length,
            commandPORT,
            droneIP,
            (error, bytes) => {
                if (error) throw error
                else {
                    console.log('Command : ' + droneCommand)
                }
            }
        )
    }

    function ghost(button) {
        return new Promise((resolve) => {
            if (document.getElementById(button).style != null) {
                setTimeout(() => {
                    document.getElementById(button).style.backgroundColor =
                        'var(--ghost)'
                }, 250)
            }
        })
    }

    async function ghostHover(button) {
        if (document.getElementById(button).style != null) {
            document.getElementById(button).style.backgroundColor =
                'var(--button-clicked)'
            const result = await ghost(button)
        }
    }

    // this is for the green glow on the
    // stream button when on, but I'm too tired
    
    // async function streamActive(button) {
    //     if (document.getElementById(button).style != null) {
    //         document.getElementById(button).style.boxShadow =
    //             'inset 0px 0px 0px var(--padding-tiny) #05d617'
    //         const result = await ghost(button)
    //     }
    // }
    // useEffect(() => {
    //     stream % 2 === 0
    //         ? sendCommand('streamoff') || ghostHover('stream-button')
    //         : sendCommand('streamon') || streamActive('stream-button')
    // }, [stream])

    const [keysIsChecked, setKeysIsChecked] = useState(false)
    const [stream, setStream] = useState(0)

    const handleKeys = () => {
        setKeysIsChecked(!keysIsChecked)
    }

    useEffect(() => {
        stream % 2 === 0
            ? sendCommand('streamoff') || ghostHover('stream-button')
            : sendCommand('streamon') || ghostHover('stream-button')
    }, [stream])

    // finding some directions in life
    // mostly up, down, left and right here
    // keypress events are tracked for keyboard
    // arrows, alongside WASD; Q and E rotation,
    // and T and L for takeoff and landing.
    // Spacebar is the emergency cut

    useKeyPress((e) => {
        if (
            document.activeElement === document.getElementById('notes') ||
            document.activeElement === document.getElementById('lat') ||
            document.activeElement === document.getElementById('long')
        ) {
            return
        } else {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                sendCommand('left ' + controlSensitivity)
                e.onkeydown = ghostHover('left-button')
                // e.onkeyup = ghost('left-button')
                e.preventDefault()
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                sendCommand('right ' + controlSensitivity)
                e.onkeydown = ghostHover('right-button')
                e.preventDefault()
            } else if (e.key === 'ArrowUp' || e.key === 'w') {
                sendCommand('forward ' + controlSensitivity)
                e.onkeydown = ghostHover('forward-button')
                e.preventDefault()
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                sendCommand('back ' + controlSensitivity)
                e.onkeydown = ghostHover('back-button')
                e.preventDefault()
            } else if (e.key === 'e') {
                sendCommand('ccw ' + rotationSensitivity)
                e.onkeydown = ghostHover('ccw-button')
                e.preventDefault()
            } else if (e.key === 'q') {
                sendCommand('cw ' + rotationSensitivity)
                e.onkeydown = ghostHover('cw-button')
                e.preventDefault()
            } else if (e.code === 'BracketLeft') {
                sendCommand('down ' + controlSensitivity)
                e.onkeydown = ghostHover('down-button')
                e.preventDefault()
            } else if (e.code === 'BracketRight') {
                sendCommand('up ' + controlSensitivity)
                e.onkeydown = ghostHover('up-button')
                e.preventDefault()
            } else if (e.key === 't') {
                sendCommand('takeoff')
                e.onkeydown = ghostHover('takeoff-button')
                e.preventDefault()
            } else if (e.key === 'l') {
                sendCommand('land')
                e.onkeydown = ghostHover('land-button')
                e.preventDefault()
            } else if (e.code === 'Space') {
                sendCommand('emergency')
                e.preventDefault()
                console.log('emergency stop')
            }
        }
    })

    useEffect(() => {
        // Initial Startup Command
        sendCommand('command')

        // Maintain Connection (Every 15 Seconds)
        const commandInterval = setInterval(() => {
            sendCommand('command')
        }, 15000)

        return () => clearInterval(commandInterval)
    }, [])

    return (
        <div className="controls-container">
            <div className="slider-controls">
                <div className="slider-controls-container">
                    <div className="slider-one">
                        <p className="small">
                            Control Sensitivity
                            <RangeSlider
                                min={20}
                                max={500}
                                variant={'secondary'}
                                value={controlSensitivity}
                                onChange={(changeEvent) =>
                                    setControlSensitivity(
                                        changeEvent.target.value
                                    )
                                }
                            />
                        </p>
                    </div>
                    <div className="slider-two">
                        <p className="small">
                            Rotation Sensitivity
                            <RangeSlider
                                min={1}
                                max={360}
                                variant={'secondary'}
                                value={rotationSensitivity}
                                onChange={(changeEvent) =>
                                    setRotationSensitivity(
                                        changeEvent.target.value
                                    )
                                }
                            />
                        </p>
                    </div>
                    <div className="slider-three">
                        <p className="small">
                            Speed Setting &nbsp;&nbsp;
                            <button
                                className="small-button"
                                onClick={() =>
                                    sendCommand('speed ' + speedSetting)
                                }
                            >
                                Set Speed {speedSetting}
                            </button>
                            <RangeSlider
                                min={10}
                                max={100}
                                variant={'secondary'}
                                value={speedSetting}
                                onChange={(changeEvent) =>
                                    setSpeedSetting(changeEvent.target.value)
                                }
                            />
                        </p>
                    </div>
                </div>
            </div>

            <div className="primary-controls">
                <div className="primary-controls-container">
                    <div className="takeoff-button">
                        <button
                            className="quiet 
                            center-flight-button smaller plex"
                            id="takeoff-button"
                            onClick={() => {
                                sendCommand('takeoff')
                                ghostHover('takeoff-button')
                            }}
                        >
                            TAKEOFF
                        </button>
                    </div>
                    <div className="land-button">
                        <button
                            className="quiet center-flight-button  smaller plex"
                            id="land-button"
                            onClick={() => {
                                sendCommand('land')
                                ghostHover('land-button')
                            }}
                        >
                            LAND
                        </button>
                    </div>
                    <div className="upButton">
                        <button
                            className="flight-button smaller plex"
                            id="up-button"
                            onClick={() => {
                                sendCommand('up ' + controlSensitivity)
                                ghostHover('up-button')
                            }}
                        >
                            UP
                        </button>
                    </div>
                    <div className="downButton">
                        <button
                            className="flight-button smaller plex"
                            id="down-button"
                            onClick={() => {
                                sendCommand('down ' + controlSensitivity)
                                ghostHover('down-button')
                            }}
                        >
                            DOWN
                        </button>
                    </div>
                    <div className="leftButton">
                        <button
                            id="left-button"
                            className="flight-button plex"
                            onClick={() => {
                                sendCommand('left ' + controlSensitivity)
                                ghostHover('left-button')
                            }}
                        >
                            ←
                        </button>
                    </div>
                    <div className="rightButton">
                        <button
                            id="right-button"
                            className="flight-button plex"
                            onClick={() => {
                                sendCommand('right ' + controlSensitivity)
                                ghostHover('right-button')
                            }}
                        >
                            →
                        </button>
                    </div>
                    <div className="ccwButton">
                        <button
                            className="flight-button plex"
                            id="ccw-button"
                            onClick={() => {
                                sendCommand('ccw ' + rotationSensitivity)
                                ghostHover('ccw-button')
                            }}
                        >
                            ↺
                        </button>
                    </div>
                    <div className="cwButton">
                        <button
                            className="flight-button plex"
                            id="cw-button"
                            onClick={() => {
                                sendCommand('cw ' + rotationSensitivity)
                                ghostHover('cw-button')
                            }}
                        >
                            ↻
                        </button>
                    </div>
                    <div className="forwardButton">
                        <button
                            id="forward-button"
                            className="flight-button  plex"
                            onClick={() => {
                                sendCommand('forward ' + controlSensitivity)
                                ghostHover('forward-button')
                            }}
                        >
                            ↑
                        </button>
                    </div>
                    <div className="backButton">
                        <button
                            id="back-button"
                            className="flight-button  plex"
                            onClick={() => {
                                sendCommand('back ' + controlSensitivity)
                                ghostHover('back-button')
                            }}
                        >
                            ↓
                        </button>
                    </div>
                </div>
            </div>
            <div className="secondary-controls">
                {/* refactoring from toggle to button for the time being */}
                {/* <div class="switch-container">
                    <div className="keyboard-input">
                        <input
                            type="checkbox"
                            id="keyboard-input"
                            name="keyboard-input"
                            value="Keyboard"
                            checked={keysIsChecked}
                            onChange={handleKeys}
                        />
                    </div>
                    <div className="keyboard-status quiet">
                        {keysIsChecked ? 'Keys ON' : 'Keys OFF'}
                    </div>
                </div> */}

                <div className="secondary-controls-container">
                    {/* <div className="emergencyButton border"> */}
                    <div className="emergency-box">
                        <div className="emergency-wrapper">
                            <button
                                className="emergency-button plex-bold"
                                id="emergency-button"
                                onClick={() => {
                                    sendCommand('emergency')
                                    // emergencyHover('emergency-button')
                                }}
                            >
                                Emergency
                            </button>
                        </div>
                    </div>
                    {/* <div className="speedButton">
                        <button
                            className="flight-button plex smaller"
                            id="speed-button"
                            onClick={() => {
                                sendCommand('speed ' + speedSetting)
                                ghostHover('speed-button')
                            }}
                        >
                            Speed
                        </button>
                    </div> */}
                    <div className="streamOnButton">
                        <button
                            className="flight-button plex smaller"
                            id="stream-button"
                            onClick={() => {
                                setStream(stream + 1)
                            }}
                        >
                            Stream
                        </button>
                    </div>
                    {/* <div className="keys-button">
                        <button
                            className="flight-button plex smaller"
                            id="keys-button"
                            onClick={() => {
                                handleKeys()
                                ghostHover('keys-button')
                            }}
                        >
                            Keys
                        </button>
                    </div> */}
                    {/* NOTE: set button to show state -VDR */}
                </div>
            </div>
        </div>
    )
}

export default FlightControls
