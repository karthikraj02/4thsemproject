import React, { useEffect, useState } from "react";

export default function DeviceList() {
  const [devices, setDevices] = useState([]);

  const scan = () => {
    fetch("http://localhost:5000/devices")
      .then(res => res.json())
      .then(data => setDevices(data));
  };

  const connect = async (ip) => {
    await fetch("http://localhost:5000/connect", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ip })
    });

    alert("Connected to " + ip);
  };

  useEffect(scan, []);

  return (
    <div>
      <button className="scan-btn" onClick={scan}>
        🔍 Scan Devices
      </button>

      {devices.map((d, i) => (
        <div
          key={i}
          className="device-card"
          onClick={() => connect(d)}
        >
          🟢 {d}
        </div>
      ))}
    </div>
  );
}