const express = require("express");
const serverless = require("serverless-http");
const router = require("./routes/recipe");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const dbCloudUrl = "mongodb+srv://recipetry:qwer1234@recipes.pxbfhwm.mongodb.net/";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(dbCloudUrl)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);