const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const { db } = require("./firebase.js");
const app = express();

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Server running at ${port}`));

const getCurrentDegree = async () => {
  try {
    const response = await fetch(
      "http://blynk-cloud.com/9324999f577f4417997a0b59170b980e/get/v5"
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};

const addCurrentDegree = async () => {
  try {
    const newDegree = await getCurrentDegree();
    const obj = {
      temp: newDegree[0],
      time: new Date().getTime(),
    };
    await db.collection("degrees").doc().set(obj);
  } catch (err) {
    console.error(err);
  }
};
setInterval(addCurrentDegree, 60000);

const getLastDegrees = async () => {
  try {
    const snapshots = await db
      .collection("degrees")
      .orderBy("time", "desc")
      .limit(5)
      .get();
    const degrees = [];
    snapshots.forEach((doc) => degrees.push(doc.data()));

    return degrees;
  } catch (err) {
    console.error(err);
  }
};

const calculateDegreeChange = async () => {
  const degrees = await getLastDegrees();
  for (let obj of degrees) {
    if (obj.temp > degrees[0].temp) {
      return "sinking";
    }
  }
  return "rising";
};

app.get("/", async (req, res) => {
  try {
    const change = await calculateDegreeChange();
    res.status(200).send(change);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
