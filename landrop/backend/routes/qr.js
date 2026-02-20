const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();

router.get("/generate", async (req, res) => {
  const connectionInfo = JSON.stringify({
    ip: "192.168.1.5",
    port: 5001,
    session: Date.now()
  });

  const qr = await QRCode.toDataURL(connectionInfo);
  res.json({ qr });
});

module.exports = router;
