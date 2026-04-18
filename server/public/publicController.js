const express = require("express");
const path = require("path");

const router = express.Router();

const indexHtmlPath = path.join(__dirname, "..", "index.html");

router.get("/", (req, res) => {
  res.sendFile(indexHtmlPath);
});

module.exports = router;
