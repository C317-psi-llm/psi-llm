const express = require("express");
const path = require("path");
const publicController = require("./public/publicController");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use("/public", publicController);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
