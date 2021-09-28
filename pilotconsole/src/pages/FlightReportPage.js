import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import JobDetailContext from "../JobDetailContext";
import FlightReport from "../components/FlightReport";
// import VideoUploadForm from "../components/VideoUploadForm" 


const FlightReportPage = () => {
  const jobContext = useContext(JobDetailContext);
  const history = useHistory();

  // const [loading, setLoading] = useState();

  const [loadedFlight, setLoadedFlight] = useState();

  const [saveError, setSaveError] = useState();

  // const [flightId, setFlightId] = useState()

  // setFlightId(jobContext.activeJob)

  // console.log("flightId", flightId)
  console.log("jobContext.activeJob", jobContext.activeJob);

  useEffect(() => {
    // setLoading(true);
    const fetchFlight = async () => {
      try {
        let receivedFlight = await fetch(
          `http://localhost:3001/api/work_orders/work_order/${jobContext.activeJob}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let responseData = await receivedFlight.json();
        console.log("responseData.flight:", responseData.flight);
        setLoadedFlight(responseData.flight);
      } catch (err) {
        console.log("error:", err);
      }
      // setLoading(false);
    };
    fetchFlight();
  }, [jobContext.activeJob]);
  console.log("loadedFlight from FlightReportPage.js", loadedFlight)
  
  const onSave = async (editedFlight) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/work_orders/work_order/update/${jobContext.activeJob}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: true,
          body: JSON.stringify(editedFlight),
        }
      );

      console.log("Edit response is", response);
      if (response.status === 500) {
        let errorMessage = await response.text();
        console.log("We had an error.  it was: ", errorMessage);
        setSaveError(errorMessage);
      } else {
        setSaveError(undefined);
        alert("Your report has been submitted")
      }
    } catch (error) {
      console.error("Fetch failed to reach the server.");
    }
  };

  if(loadedFlight) {
    return (
      <div>
        <FlightReport onSave={onSave} flight={loadedFlight} />
      </div>
    )
  } else {
    return (
    <div>
      <p>Something went wrong. Please try again later</p>
      <button
          onClick={() => {
            history.push("/pilotconsole");
          }}>          
          Back to Pilot Console
          </button>
          </div>
    )
}
};

export default FlightReportPage;
