import React from "react";

export default function Radar() {

  return (
    <div className="radar">

      <div className="ring r1"></div>
      <div className="ring r2"></div>
      <div className="ring r3"></div>

      <div className="center-dot"></div>

      <p>Scanning nearby devices...</p>

    </div>
  );
}