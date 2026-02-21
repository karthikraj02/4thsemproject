import React, { useState } from "react";

export default function ChatWindow() {
  const [msg, setMsg] = useState("");

  const send = async () => {
    await fetch("http://localhost:5000/message", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message: msg })
    });

    setMsg("");
  };

  return (
    <div className="section">
      <h2>💬 Chat</h2>

      <input
        className="chat-box"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={send}>Send</button>
    </div>
  );
}
