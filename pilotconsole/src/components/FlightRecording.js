import { useContext, useState, useRef } from 'react'
import JobDetailContext from '../JobDetailContext'
import "./FlightRecording.css";

const { desktopCapturer } = window.require('electron');
const { writeFile } = window.require('fs');
const { dialog } = window.require('electron').remote;

const FlightRecording = () => {

    const jobContext = useContext(JobDetailContext)

    const recordedChunks = []

    const [recording, setRecording] = useState(false)
    const mediaRecorder = useRef()

    async function init() {

        //variables to source.id for the main pilot console
        let sourceID_PilotConsole
        // if PilotConsole cannot be found, use Screen 1 or Entire Screen
        let sourceID_Screen1
        let sourceID_EntireScreen
        let sourceID

        // gets all the windows available for streaming
        const inputSources = await desktopCapturer.getSources({
            types: ['window', 'screen']
        });

        // search for 'Pilot Console'
        let pilotConsoleFound = false
        let screen1Found = false
        inputSources.forEach(source => {
            console.log(source)
            if (source.name === "Pilot Console") {
                sourceID_PilotConsole = source.id
                pilotConsoleFound = true
            }
            if (source.name === "Screen 1") {
                sourceID_Screen1 = source.id
                screen1Found = true
            }
            if (source.name === "Entire Screen") {
                sourceID_EntireScreen = source.id
            }

        });

        // if 'Pilot Console' window isn't found, default to record Screen 1 or Entire Screen
        if (pilotConsoleFound)
            sourceID = sourceID_PilotConsole
        else if (screen1Found)
            sourceID = sourceID_Screen1
        else
            sourceID = sourceID_EntireScreen

        return sourceID

    }

    async function onClickStartButton() {
        //getVideoSources()
        let stream

        // set up media recorder to read the stream from the pilot console screen
        let sourceID = await init()

        //set stream to get 'Pilot Console' screen
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceID,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
        }

        if (stream) {

            const options = { mimeType: 'video/webm; codecs=vp9' }
            mediaRecorder.current = new MediaRecorder(stream, options)

            mediaRecorder.current.ondataavailable = handleDataAvailable
            mediaRecorder.current.onstop = handleStop

            mediaRecorder.current.start(100)
            console.log("recording started")
            setRecording(true)
        } else {
            alert("Error encountered loading video stream")
        }

    }

    // action on recording stopped triggered from pilot console
    function onClickStopButton() {
        mediaRecorder.current.stop()
        setRecording(false)
    }

    // Captures all recorded chunks
    function handleDataAvailable(event) {
        console.log('data being recorded');
        recordedChunks.push(event.data);
    }

    // Saves the video file when MediaRecorder commanded to stop
    async function handleStop(event) {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });
        console.log("recording stopped")
        console.log(blob)
        const buffer = Buffer.from(await blob.arrayBuffer())

        function defineFilePath() {
            const d = new Date()
            console.log(jobContext.activeJob)
            if (jobContext.activeJob) {
                //get jobID, slice to 8 characters
                let jobID = (jobContext.activeJob).slice(0, 8)
                return (`WO${jobID}_${d.getMonth().toString()}-${d.getDate()}-${d.getFullYear()}_${d.getHours()}${d.getMinutes()}.webm`)
            }
            else return (`Flight_${d.getMonth().toString()}-${d.getDate()}-${d.getFullYear()}_${d.getHours()}${d.getMinutes()}.webm`)
        }

        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: defineFilePath()
        })

        if (filePath)
            writeFile(filePath, buffer, () => console.log('Drone flight saved', filePath))

    }

    return (
        <div className="flightrecording-container">
            {recording && <span className="flightrecording-message">Screen Recording in Progress &nbsp;</span>}
            Flight Screen Recording:&nbsp;
            {!recording && <button className="small-button flightrecording-button" onClick={onClickStartButton}><span className="dot" /> Record</button>}
            {recording && <button className="small-button flightrecording-button" onClick={onClickStopButton}><span className="square" />Stop</button>}

        </div>
    )


}

export default FlightRecording

