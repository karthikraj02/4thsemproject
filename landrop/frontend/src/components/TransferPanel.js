import React, { useState, useContext } from "react";
import { ConnectionContext } from "../context/ConnectionContext";

export default function TransferPanel() {

  const { connectedDevice } = useContext(ConnectionContext);

  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  /* 📤 Send file function */
  const sendFile = async (filePath) => {

    if (!connectedDevice) {
      alert("Connect to a device first");
      return;
    }

    if (!filePath) return;

    setStatus("Sending...");
    setProgress(10);

    try {
      await fetch("http://localhost:5000/send-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          ip: connectedDevice.ip
        })
      });

      // ⭐ Simulated progress animation
      let p = 10;
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          setStatus("Transfer complete!");
        }
      }, 250);

    } catch (err) {
      setStatus("File transfer failed");
      console.error(err);
    }
  };

  /* 🖱️ Drag & Drop handler */
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
      sendFile(file.path); // Electron provides path
    }
  };

  /* ⌨️ Manual path entry (fallback) */
  const manualSend = () => {
    const filePath = prompt("Enter full file path:");
    sendFile(filePath);
  };

  return (
    <div className="section">

      <h2>📦 File Transfer</h2>

      {/* Manual send button */}
      <button onClick={manualSend}>
        Send File (Manual)
      </button>

      {/* Drag & Drop Zone */}
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        📂 Drag & Drop File Here
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Status */}
      <p>{status}</p>

    </div>
  );
}