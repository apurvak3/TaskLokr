const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const focusRoutes = require("./routes/focus");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tasklokr");
console.log("mongoose connected")

app.use("/focus", focusRoutes);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
