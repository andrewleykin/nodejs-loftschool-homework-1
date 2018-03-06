const fs = require('fs');
const path = require('path');

function mySortFunction (from, to, bool) {
  return new Promise(function (resolve, reject) {
    const base = from;
    const ready = to;

    fs.mkdir(ready);

    const readDir = (base, level) => {
      const files = fs.readdirSync(base);

      files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        const firstChar = item.charAt(0).toUpperCase();
        const pathFirstChar = path.join(ready, firstChar);

        if (state.isDirectory()) {
          readDir(localBase, level + 1);
        } else {
          if (!fs.existsSync(pathFirstChar)) {
            fs.mkdir(pathFirstChar);
          }
          fs.copyFileSync(localBase, path.join(pathFirstChar, item));
        }
      });
    };

    const removeDir = (base) => {
      const files = fs.readdirSync(base);

      if (fs.existsSync(base)) {
        files.forEach(function (item) {
          let localBase = path.join(base, item);
          let state = fs.lstatSync(localBase);
          if (state.isDirectory()) {
            removeDir(localBase);
          } else {
            fs.unlinkSync(localBase);
          }
        });
        fs.rmdirSync(base);
      }
    };

    readDir(base, 0);

    if (bool) {
      removeDir(base);
    }
    resolve();
  });
}

async function sortAsync (from, to, bool) {
  await mySortFunction(from, to, bool);
}

sortAsync('./test', './ready', false)
  .then(() => {
    console.log('Success');
  })
  .catch((error) => {
    console.log(error);
  });
