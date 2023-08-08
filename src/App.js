import React, { useState } from "react"; // Import React and useState
import { Web3Storage } from "web3.storage";
import { create } from "ipfs-http-client";

const App = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAccessToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhOTM2OWQxMzU5ODA5QzM1ZDhiODRjMGVjNDA5NzRGN0QyODhmYTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE1MTgwMjA2NjUsIm5hbWUiOiJpcGZzX2ZpbGUifQ.Xoq3NEHglUKD1qFBo5-URotk8WB3Dbcnnn5MTSiLaww"; // Replace with your actual access token
  };

  const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setAllFiles([...allFiles, file]);
      setUploadMessage("");
    } else {
      setUploadMessage("No file selected");
    }
  };

  const handleUpload = async () => {
    if (allFiles.length > 0) {
      // Check if any files are selected
      const client = makeStorageClient();
      const uploadResults = [];

      for (const file of allFiles) {
        const name = file.name; // Get the original file name
        const cid = await client.put([file], { name }); // Upload the file with its original name
        uploadResults.push({ name, cid });
      }

      console.log("Uploaded files:", uploadResults);
      setAllFiles([]); // Clear the uploaded files array
    } else {
      setUploadMessage("No files selected for upload");
    }
  };

  const listUploads = async () => {
    const client = makeStorageClient();
    const uploads = [];
    for await (const upload of client.list()) {
      uploads.push({
        name: upload.name,
        cid: upload.cid,
        size: upload.dagSize,
      });
    }
    setUploadedFiles(uploads);
  };

  return (
    <div>
      <h1>Web3.Storage File Upload</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={listUploads}>List Uploads</button>
      </div>
      {uploadMessage && <p>{uploadMessage}</p>}
      <div>
        <h2>Uploaded Files</h2>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <a href={`https://dweb.link/ipfs/${file.cid}`}>{file.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
