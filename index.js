const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const cron = require("node-cron");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

cron.schedule("*/1 * * * * *", function () {
  console.log("---------------------");
  console.log("running a task every 15 seconds");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
