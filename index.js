const express = require('express');
const request = require('request');
const env = require('dotenv').config();

const test = process.env.TEST;

const PORT = process.env.PORT || 8080
const app = express();

const lastfm = {
  user: process.env.LAST_FM_USER,
  apiKey: process.env.LAST_FM_API_KEY
};

app.get('/', (req, res) => {
  // Scraping to come
  console.log("Thump, thump, thump...");
  console.log(test);

  let targetUrl =
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&extended=1&limit=200&from=1514764800`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });

});

app.listen(PORT, () => {
  console.log(`Server heart is beating, listen at ${PORT}`);
});

module.exports = app;