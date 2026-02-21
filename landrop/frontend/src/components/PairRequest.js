import React from "react";

export default function PairRequest({ device, onAccept, onReject }) {

  if (!device) return null;

  return (
    <div className="pair-overlay">

      <div className="pair-box">

        <h2>📡 Connection Request</h2>

        <p>
          <strong>{device.name}</strong> wants to connect
        </p>

        <div className="pair-buttons">
          <button onClick={onAccept}>Accept</button>
          <button onClick={onReject}>Reject</button>
        </div>

      </div>
    </div>
  );
}