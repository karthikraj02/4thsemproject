const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const { execFile } = require("child_process");
const os = require("os");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

/* 🐍 Python paths */
const python = "python";
const enginePath = path.join(__dirname, "../python_engine");


// ===============================
// 🔥 CREATE HTTP + SOCKET SERVER
// ===============================

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});


// ===============================
// 🛰️ SOCKET CONNECTION HANDLING
// ===============================

io.on("connection", (socket) => {

  console.log("🔗 Client connected:", socket.id);

  // When one device connects to another
  socket.on("device-connected", (data) => {

    console.log("Device connected event:", data);

    // Notify ALL other devices
    socket.broadcast.emit("incoming-connection", data);

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// ===============================
// 🔍 DEVICE DISCOVERY (NAME + IP)
// ===============================

app.get("/devices", (req, res) => {

  execFile(
    python,
    [path.join(enginePath, "discovery_client.py")],
    { timeout: 5000 },

    (err, stdout) => {

      if (err || !stdout) {
        console.error("Discovery error:", err);
        return res.json([]);
      }

      const devices = stdout
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean)
        .map(line => {
          const [name, ip] = line.split("|");
          return { name: name || "Unknown", ip };
        });

      res.json(devices);
    }
  );
});


// ===============================
// 💬 SEND MESSAGE
// ===============================

app.post("/message", (req, res) => {

  const { message, ip } = req.body;

  if (!message || !ip)
    return res.status(400).send("Missing message or IP");

  execFile(
    python,
    [path.join(enginePath, "client.py"), "msg", message, ip],
    () => {}
  );

  res.send("Message sent");
});


// ===============================
// 📦 SEND FILE
// ===============================

app.post("/send-file", (req, res) => {

  const { path: filePath, ip } = req.body;

  if (!filePath || !ip)
    return res.status(400).send("Missing file path or IP");

  execFile(
    python,
    [path.join(enginePath, "client.py"), "file", filePath, ip],
    () => {}
  );

  res.send("File sent");
});


// ===============================
// 📱 QR CONNECTION
// ===============================

app.get("/qr", async (req, res) => {

  let ip = "127.0.0.1";
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        ip = net.address;
      }
    }
  }

  const info = JSON.stringify({ ip, port: 5001 });
  const qr = await QRCode.toDataURL(info);

  res.json({ qr });
});


// ===============================
// 🔗 CONNECT TO DEVICE (MANUAL)
// ===============================

app.post("/connect", (req, res) => {

  const { ip, name } = req.body;

  if (!ip)
    return res.status(400).send("IP required");

  execFile(
    python,
    [path.join(enginePath, "client.py"), "msg", "Connected", ip],
    () => {}
  );

  // 🔔 Notify all devices via WebSocket
  io.emit("incoming-connection", {
    name: name || "Unknown Device",
    ip
  });

  res.send("Connected to " + ip);
});


// ===============================
// 🚀 AUTO CONNECT
// ===============================

app.get("/auto-connect", (req, res) => {

  execFile(
    python,
    [path.join(enginePath, "discovery_client.py")],
    { timeout: 5000 },

    (err, stdout) => {

      if (err || !stdout)
        return res.json({ status: "No devices found" });

      const devices = stdout
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean)
        .map(line => {
          const [name, ip] = line.split("|");
          return { name, ip };
        });

      const first = devices[0];

      execFile(
        python,
        [path.join(enginePath, "client.py"), "msg", "Auto Connected", first.ip],
        () => {}
      );

      // 🔔 Notify all devices
      io.emit("incoming-connection", first);

      res.json({
        status: "Connected",
        name: first.name,
        ip: first.ip
      });
    }
  );
});


// ===============================
// 🚀 START SERVER
// ===============================

server.listen(5000, () =>
  console.log("🚀 Backend running on http://localhost:5000")
);