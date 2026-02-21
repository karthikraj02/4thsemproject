import React, { useEffect, useState, useContext } from "react";
import { ConnectionContext } from "../context/ConnectionContext";
import Toast from "./Toast";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DeviceList() {

  const { setConnectedDevice } = useContext(ConnectionContext);

  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [toastMsg, setToastMsg] = useState("");

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

        const device = {
          name: data.name || "Unknown Device",
          ip: data.ip
        };

        setConnectedDevice(device);

        const msg = `Connected to ${device.name}`;
        setStatus(msg);
        setToastMsg(msg);

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
        body: JSON.stringify({
          ip: device.ip,
          name: device.name   // ⭐ Send name too
        })
      });

      setConnectedDevice(device);

      const msg = `Connected to ${device.name}`;
      setStatus(msg);
      setToastMsg(msg);

    } catch (err) {
      setStatus("Connection failed");
      console.error(err);
    }
  };

  /* 🛰️ LISTEN FOR INCOMING CONNECTIONS */
  useEffect(() => {

    socket.on("incoming-connection", (data) => {

      const msg = `${data.name} connected to you`;

      setStatus(msg);
      setToastMsg(msg);

    });

    return () => socket.off("incoming-connection");

  }, []);

  /* 🚀 Run scan on startup */
  useEffect(() => {
    scan();

    // ⭐ Optional zero-click mode
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

      {/* 🔔 Popup Notification */}
      <Toast
        message={toastMsg}
        onClose={() => setToastMsg("")}
      />

    </div>
  );
}