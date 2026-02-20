import React from "react";

export default function TransferPanel() {

  const sendFile = async () => {
    const filePath = prompt("Enter full file path:");

    await fetch("http://localhost:5000/send-file", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ path: filePath })
    });
  };

  return (
    <div className="section">
      <h2>📦 File Transfer</h2>

      <button onClick={sendFile}>
        Send File
      </button>

      <div className="drop-zone">
        Drag & Drop files here (future feature)
      </div>
    </div>
  );
}
