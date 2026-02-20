import React, { useEffect, useState } from "react";

export default function DeviceList() {

  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState("Idle");

  /* 🔍 Scan for devices */
  const scan = async () => {
    setStatus("Scanning...");

    try {
      const res = await fetch("http://localhost:5000/devices");
      const data = await res.json();

      setDevices(data);
      setStatus("Scan complete");
    } catch (err) {
      setStatus("Scan failed");
      console.error(err);
    }
  };

  /* ⚡ Auto connect nearby device */
  const autoConnect = async () => {
    setStatus("Auto connecting...");

    try {
      const res = await fetch("http://localhost:5000/auto-connect");
      const data = await res.json();

      if (data.ip) {
        setStatus(`Connected to ${data.name} (${data.ip})`);
      } else {
        setStatus(data.status);
      }
    } catch (err) {
      setStatus("Auto-connect failed");
      console.error(err);
    }
  };

  /* 🔗 Connect manually */
  const connect = async (device) => {
    setStatus(`Connecting to ${device.name}...`);

    try {
      await fetch("http://localhost:5000/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: device.ip })
      });

      setStatus(`Connected to ${device.name} (${device.ip})`);
    } catch (err) {
      setStatus("Connection failed");
      console.error(err);
    }
  };

  /* 🚀 Run scan on startup */
  useEffect(() => {
    scan();

    // ⭐ OPTIONAL: true AirDrop-style auto connect
    // autoConnect();

  }, []);

  return (
    <div>

      {/* Buttons */}
      <button className="scan-btn" onClick={scan}>
        🔍 Scan Devices
      </button>

      <button onClick={autoConnect}>
        ⚡ Auto Connect Nearby
      </button>

      {/* Status */}
      <p style={{ marginTop: "10px", color: "#94a3b8" }}>
        Status: {status}
      </p>

      {/* Device List */}
      {devices.length === 0 && (
        <p style={{ color: "#64748b" }}>
          No devices found
        </p>
      )}

      {devices.map((d, i) => (
        <div
          key={i}
          className="device-card"
          onClick={() => connect(d)}
        >
          💻 {d.name}
          <br />
          <small style={{ color: "#94a3b8" }}>{d.ip}</small>
        </div>
      ))}

    </div>
  );
}