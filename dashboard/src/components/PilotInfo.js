import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ReactDOM from "react-dom"
//import moment from "moment";
import Modal from "../components/modal/Modal";

import { faPortrait } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './PilotInfo.css'

const PilotInfo = () => {
  const [pilotData, setPilotData] = useState();

  const pilotName = useParams().pilot;
  console.log("pilotName:", pilotName);

  const history = useHistory();

  // let qtyOfFlights

  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchPilot = async () => {
      let pilotDetails = await fetch(`/api/work_orders/pilot/${pilotName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let responseData = await pilotDetails.json();
      console.log("responseData:", responseData);
      setPilotData(responseData.flights);
    };
    fetchPilot();
  }, []);

  let listOfFlights = [];
  //let totalHoursOfFlight;

  if (pilotData) {
    console.log("pilotData:", pilotData);

    for (let data of pilotData) {
      if (data.status === "Completed") {
        listOfFlights.push(data.time);
      }
    }

    console.log("listOfFlights:", listOfFlights);

    // const sumOfFlightTime = listOfFlights
    //   .slice(1)
    //   .reduce(
    //     (prev, cur) => moment.duration(cur).add(prev),
    //     moment.duration(listOfFlights[0])
    //   );

    // totalHoursOfFlight = moment
    //   .utc(sumOfFlightTime.asMilliseconds())
    //   .format("HH:mm:ss");
  }
  // console.log("totalHoursOfFlight:", totalHoursOfFlight);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* <Button onClick={() => setShow(true)}>Open Modal</Button> */}
      </div>
      <Modal 
        show={show} 
        onClose={() => {
          setShow(false)
          history.push("/workorders")
        }}>
        <div className="pilot-info-wrapper">
          
          <FontAwesomeIcon
              icon={faPortrait}
              className="pilot-icon"
          />

          <br></br>
          <h3>Pilot: {pilotName}</h3>
          <br></br>
          
          {pilotData && (
            <div>
              <div>Number of flights: {listOfFlights.length}</div>
              {/* <div>Hours of flight: {totalHoursOfFlight} </div> */}
            </div>
          )}
          {!pilotData && (
            <div>There are no previous flights for this pilot</div>
          )}
        </div>
      </Modal>
      </div>, document.getElementById('overlay-root')

      )}
    </React.Fragment>
  );
};

export default PilotInfo;
