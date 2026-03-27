const express = require("express");
const db = require("./db");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello Mosca!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
