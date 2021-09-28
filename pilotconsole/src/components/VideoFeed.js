import React, { useEffect } from "react"
import JMuxer from "jmuxer"
import "./VideoFeed.css"

const Buffer = require('buffer').Buffer

const VideoFeed = ({ DroneVideoFeed }) => {

    useEffect(() => {
        let jmuxer = new JMuxer({
            node: 'player',
            mode: 'video',
            fps: 30,
            flushingTime: 1,
        })

        const parseVideo = (dataStream) => {
            jmuxer.feed({
                video: Buffer.from(dataStream)
            })
        }

        DroneVideoFeed.on('message', (videoDataStream) => {
            parseVideo(videoDataStream)
        })

    }, [])

    // Video Size => 640x360 (50% of Original 720p)
    return (
        <div className="video-main">
            <div id="videoFeed">
                <video autoPlay={true} id={"player"} height={"360"} width={"640"}></video>
            </div>
        </div>
    )
}

export default VideoFeed