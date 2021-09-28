import { useState, useContext } from "react";

import Axios from "axios";

import JobDetailContext from "../JobDetailContext";

const VideoUploadForm = () => {
  const [fileInput, setFileInput] = useState();
  const [videoName, setVideoName] = useState();
  const [isUploading, setIsUpoading] = useState(false);

  const jobContext = useContext(JobDetailContext);

  const videoUpload = async (e) => {
    const file = e.target.files[0];
    console.log("file:", file);
    const fileName = encodeURIComponent(file.name);
    console.log("fileName:", fileName);
    setFileInput(file);
    setVideoName(fileName);
  };

  let awsResponse;
  let dbResponse;
  const submitFileToAWS = async () => {
    setIsUpoading(true);
    const formData = new FormData();

    formData.append("file", fileInput);
    try {
      const upload = await Axios({
        method: "POST",
        url: "http://localhost:3001/api/aws/upload_video",
        data: formData,
      });

      console.log("upload:", upload);
      awsResponse = upload.statusText;
    } catch (err) {
      console.log("Error:", err);
    }

    let videoFilenameUpdate;
    try {
      videoFilenameUpdate = await Axios({
        method: "PATCH",
        data: {
          videoURL: `http://localhost:3001/api/aws/download_video/${videoName}`,
        },
        withCredentials: true,
        url: `http://localhost:3001/api/work_orders/work_order/${jobContext.activeJob}`,
      });
      console.log(videoFilenameUpdate);
      dbResponse = videoFilenameUpdate.statusText;
    } catch (err) {
      console.log("Error:", err);
    }

    if (awsResponse === "OK" && dbResponse === "OK") {
      alert("Your video has been uploaded");
    } else {
      alert("Sorry, we couldn't upload your video, please try again later");
    }
    setIsUpoading(false);
  };

  if (jobContext.activeJob) {
    return (
      <>
        <label htmlFor="video-upload">Upload Video</label>
        {isUploading && <p> Uploading Video...</p>}
        <input
          id="file"
          name="file"
          type="file"
          // accept="image/*"
          onChange={videoUpload}
        />
        <button type="submit" onClick={submitFileToAWS}>
          Upload Video
        </button>
      </>
    );
  } else {
    return null;
  }
};

export default VideoUploadForm;
