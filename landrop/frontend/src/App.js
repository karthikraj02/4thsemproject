import React from "react";
import DeviceList from "./components/DeviceList";
import ChatWindow from "./components/ChatWindow";
import TransferPanel from "./components/TransferPanel";
import QRConnect from "./components/QRConnect";
import "./styles/app.css";

function App() {
  return (
    <div className="app">

      <div className="sidebar">
        <div className="logo">LANDrop Secure</div>
        <DeviceList />
      </div>

      <div className="main">
        <QRConnect />
        <ChatWindow />
        <TransferPanel />
      </div>

    </div>
  );
}

export default App;
