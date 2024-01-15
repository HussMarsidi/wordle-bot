const puppeteer = require("puppeteer");
// const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const moment = require("moment");

const { readWords } = require("./words.js");
const { Session } = require("./session.js");
const { feedback } = require("./feedback.js");

const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--disable-infobars", "--start-maximized", "--kiosk"],
  });
  const page = await browser.newPage();

  // const recorder = new PuppeteerScreenRecorder(page);
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.nytimes.com/games/wordle/index.html");

  console.log("Load nytimes wordle page");

  const playBtn = await page.waitForSelector(
    "body > div > div > div > div > div > div.Welcome-module_buttonContainer__K4GEw > button.Welcome-module_button__ZG0Zh"
  );
  await playBtn.click();

  // enter into the game, show popup
  await page.waitForTimeout(1000);
  const closeBtn = await page.waitForSelector("#help-dialog > div > button.Modal-module_closeIcon__TcEKb");
  await closeBtn.click();

  await page.waitForTimeout(1000);

  //   // await recorder.start(`recordings/${moment(new Date()).format('YYYY-MM-DD')}.mp4`)
  const words = await readWords();
  const session = new Session(words);

  let finalWord = "";

  try {
    for (let attempt = 1; ; attempt++) {
      let word = session.getWord();
      console.log(`Attempt ${attempt}: trying word ${word}`);
      await page.keyboard.type(word + "\n", { delay: 100 });
      await page.waitForTimeout(3 * 1000);
      const rows = Array.from(await page.$$('[class^="Row-module_row"]'));
      const row = rows[attempt - 1];
      const fb = Array.from(
        await row.$$eval("[class^=Tile-module_tile]", (el) => el.map((x) => x.getAttribute("data-state")))
      );
      if (fb[0] == "tbd") {
        //no such word, do another attempt
        attempt--;
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press("Backspace");
        }
        continue;
      }
      session.giveFeedback(word, fb);
      if (!fb.find((f) => f != feedback.CORRECT_SPOT)) {
        console.log(`Today's word is ${word}`);
        finalWord = word;
        break;
      }
    }
    return finalWord;
  } catch (error) {
    throw `Error occurred, please try again later. ${error}`;
  } finally {
    //   await page.waitForTimeout(3 * 1000);
    // await recorder.stop()
    await browser.close();
  }
};

module.exports = { scrape };
