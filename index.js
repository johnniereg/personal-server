const express = require('express');
const request = require('request');

require('dotenv').config();

const PORT = process.env.PORT || 8080
const app = express();

const lastfm = {
  user: process.env.LAST_FM_USER,
  apiKey: process.env.LAST_FM_API_KEY
};

app.get('/', (req, res) => {
  res.send("(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)");
})

app.get('/api/lastfm/recent-tracks', (req, res) => {
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

app.get('/api/lastfm/user-info', (req, res) => {
  let targetUrl = 
    `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json`;

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