import React, { useEffect, useState } from "react";

export default function QRConnect() {
  const [qr, setQr] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/qr")
      .then(res => res.json())
      .then(data => setQr(data.qr));
  }, []);

  return (
    <div className="section">
      <h2>📱 Scan to Connect</h2>
      <img src={qr} alt="QR Code" className="qr" />
    </div>
  );
}
