require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const { scrape } = require("./src/scrape");
const { getHints } = require("./service/backend");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrape(res);
});

app.get("/", (req, res) => {
  cron.schedule(
    // will run at 12:03am everyday
    "3 0 * * *",
    async () => {
      try {
        await scrape();
      } catch (error) {
        console.log("Something went wrong", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kuala_Lumpur",
    }
  );

  cron.schedule("10 * * * *", () => {
    console.log("Im alive :)");
  });

  res.send("running cron job");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
