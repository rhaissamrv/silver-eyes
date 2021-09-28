import './Orientation.css'

import React, { useContext, useEffect, useState } from 'react'

import { Canvas } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import TelemetryContext from '../TelemetryContext'

const Orientation = () => {
    const telemetryContext = useContext(TelemetryContext)

    return (
        <div className="orientation-container">
            <div className="subsection-orientation">
                <Canvas>
                    <ambientLight intensity={0.75} />
                    <spotLight
                        position={[20, 20, 20]}
                        angle={0.15}
                        penumbra={0}
                    />
                    <pointLight position={[-10, -10, -10]} />
                    <Drone
                        rotation={[
                            (telemetryContext.pitch * Math.PI) / 180,
                            ((telemetryContext.yaw - 180) * Math.PI) / 180, // so model is facing forward initially
                            (telemetryContext.roll * Math.PI) / 180
                        ]}
                        position={[0, 0.25, -0.5]}
                        scale={[0.75, 0.75, 0.75]}
                    />
                </Canvas>

                {/* temporary hide of telemetry table in CSS */}
                <table className="orientation-table visually-hidden">
                    <tr>
                        <th>Pitch (deg)</th>
                        <th>Yaw (deg)</th>
                        <th>Roll (deg)</th>
                        <th>Altitude (cm)</th>
                    </tr>
                    <tr>
                        <td>{telemetryContext.pitch}</td>
                        <td>{telemetryContext.yaw}</td>
                        <td>{telemetryContext.roll}</td>
                        <td>{telemetryContext.altitude}</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

const Drone = ({ position, rotation, scale }) => {
    const [model, setModel] = useState()
    const [arrow, setArrow] = useState()

    useEffect(() => {
        new GLTFLoader().load('./assets/drone.glb', setModel)
        new GLTFLoader().load('./assets/arrow.glb', setArrow)
    }, [])

    if (!model) {
        return null
    }

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <primitive object={model.scene} />
            <primitive object={arrow.scene} />
        </group>
    )
}

export default Orientation
