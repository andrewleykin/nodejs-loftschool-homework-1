const fs = require('fs');
const path = require('path');
const settings = process.argv.slice(2);

const base = settings[0];
const ready = settings[1];

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
      fs.copyFile(localBase, path.join(pathFirstChar, item), (err) => {
        if (err) throw err;
      });
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

if (settings[2] === true) {
  removeDir(base);
}
