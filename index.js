const express = require("express");
const bodyParser = require("body-parser");
const ConnectToDB = require("./dbConnect");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
ConnectToDB();

// PORT
const PORT = 2500;

// API Endpoints
app.use("/api/auth", require("./routes/UserRoute"));
app.use(
  "/api/blog",
  require("./routes/BlogRoute"),
  require("./routes/CategoryRoute")
);

// Port Listener
app.listen(PORT, () => {
  console.log(`App is running on port: http://localhost:${PORT}`);
});
