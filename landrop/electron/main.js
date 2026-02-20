const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

function createWindow() {

  // 🚀 Start backend automatically
  exec("node backend/server.js");

  // 🚀 Start Python receiver automatically
  exec("python python_engine/server.py");

  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // ✅ Load built React app (offline)
  win.loadFile(
    path.join(__dirname, "../frontend/build/index.html")
  );
}

app.whenReady().then(createWindow);
