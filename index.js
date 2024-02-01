require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const profileRouter = require("./routes/profileRouter");
const inspectionRouter = require("./routes/inspectionRouter");
const propertyRouter = require("./routes/propertyRouter");

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// middleware
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cors());

// route
app.get("/", (req, res) => {
  res.status(200).send("BETA HOME SERVER");
});
app.use("/api/v1", profileRouter);
app.use("/api/v1", inspectionRouter);
app.use("/api/v1/property", propertyRouter);
// error route
app.use((req, res) => {
  res.status(404).send("RESOURCE NOT FOUND");
});

// db connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.mongo_url, { dbName: "betahome" });
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
