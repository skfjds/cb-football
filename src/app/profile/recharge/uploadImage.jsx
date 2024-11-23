import axios from "axios";
import React, { useState } from "react";

const UploadComponent = ({setUploaded}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      // Get authentication parameters from the backend
      const res = await (await fetch(`/api/imageKitAuth?tmsmt=${Date.now()}`)).json();
      console.log(res);

      // Create a form data object
      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", "public_vqtKMKdE65ozlbDD5YOmev2NHuQ=" );
      formData.append("signature", res.signature);
      formData.append("expire", res.expire);
      formData.append("token", res.token);
      formData.append("fileName", file.name.replace(/[^a-zA-Z0-9.]/g, '').replace(/(.*)\.(?=.*\.)/, '$1_'));

      // Upload directly to ImageKit
      const response = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedImageUrl(response.data.url);
      setUploaded(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. try again or try contact the agent");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" text-sm px-4 my-4">
      <h5 className="text-red-400 py-2" >Upload the screenshort of the payment</h5>
      <input type="file" onChange={handleFileChange} />
      {
        !uploadedImageUrl ? (
          <button className="bg-blue-700 text-white px-4 py-1 rounded-sm" onClick={handleUpload} disabled={uploading}>
            <h5>
                {uploading ? "Uploading..." : "Upload"}
            </h5>
          </button>
        ):(
          null
        )
      }
      {uploadedImageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
