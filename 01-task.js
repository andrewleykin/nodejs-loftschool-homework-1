const http = require('http');

http.createServer((req, res) => {
  const interval = setInterval(() => {
    console.log(new Date().toUTCString());
  }, 1000);
  SetTimeoutPromisy(10000).then(() => {
    clearInterval(interval);
    console.log('done');
    res.end(new Date().toUTCString());
  });
  function SetTimeoutPromisy (totalSecond) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve();
      }, totalSecond);
    });
  }
}).listen(3000);
