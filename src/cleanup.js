// create a function that will parse data from textDumps.txt
// then only return words that have 5 characters

const fs = require("fs");
const readline = require("readline");
const path = require("path");

function parseWords() {
  const words = [];
  const txtPath = path.join(__dirname, "textDumps.txt");

  try {
    const data = fs.readFileSync(txtPath, "utf8");
    const lines = data.split(/\r?\n/);

    lines.forEach((line) => {
      if (line.length === 5) {
        words.push(line);
      }
    });
  } catch (err) {
    console.error(err);
  }

  // create another file that will parse the data from textDumps.txt
  // called cleanedWords.js, if the file is empty, create the file
  // but if the file has data, then don't create the file,  only overwrite

  if (words.length > 0) {
    fs.writeFile("./cleanedWords.js", `const cleanedWords = ${JSON.stringify(words)}`, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  }
}

parseWords();
