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
  // run every 12.56AM
  cron.schedule(
    "30 7 * * *",
    async () => {
      try {
        await scrape().then(async (answer) => {
          console.log("answer", answer);
          getHints().then(({ hints }) => {
            console.log("hints", hints);
          });
        });
      } catch (error) {
        console.log("Something went wrong", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kuala_Lumpur",
    }
  );

  res.send("running cron job");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
