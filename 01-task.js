const http = require('http');
const timeInteral = 1000;
const timeOut = 10000;
const port = 3000;

http.createServer((req, res) => {
  const interval = setInterval(() => {
    console.log(new Date().toUTCString());
  }, process.env.TIME_INTERVAL || timeInteral);

  SetTimeoutPromisy(process.env.TIMEOUT || timeOut).then(() => {
    clearInterval(interval);
    res.end(new Date().toUTCString());
  });

  function SetTimeoutPromisy (totalSecond) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve();
      }, totalSecond);
    });
  }
}).listen(process.env.PORT || port);
