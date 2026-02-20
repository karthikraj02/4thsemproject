const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔍 REAL DEVICE DISCOVERY */
app.get("/devices", (req, res) => {
  exec("python ../python_engine/discovery_client.py",
    (err, stdout) => {
      if (err) return res.json([]);
      
      const devices = stdout
        .split("\n")
        .filter(x => x.trim() !== "");

      res.json(devices);
    });
});

/* 💬 SEND MESSAGE */
app.post("/message", (req, res) => {
  const msg = req.body.message;

  exec(`python ../python_engine/client.py msg "${msg}"`);
  res.send("sent");
});

/* 📦 SEND FILE */
app.post("/send-file", (req, res) => {
  const path = req.body.path;

  exec(`python ../python_engine/client.py file "${path}"`);
  res.send("file sent");
});

/* 📱 QR CONNECTION */
app.get("/qr", async (req, res) => {

  const os = require("os");
  const nets = os.networkInterfaces();

  let ip = "127.0.0.1";

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        ip = net.address;
      }
    }
  }

  const info = JSON.stringify({
    ip: ip,
    port: 5001
  });

  const qr = await QRCode.toDataURL(info);
  res.json({ qr });
});
/* 🔗 CONNECT TO DEVICE */
app.post("/connect", (req, res) => {
  const ip = req.body.ip;

  exec(`python ../python_engine/client.py msg "Connected" ${ip}`);

  res.send("Connected to " + ip);
});
app.listen(5000, () => console.log("Backend running"));
