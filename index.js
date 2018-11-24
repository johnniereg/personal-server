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
  res.send(`ಠ‿↼`);
})

// User details from Last FM
app.get('/api/lastfm/user-info', (req, res) => {
  let method = 'user.getinfo';
  let targetUrl = 
  `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Last 200 played tracks since app built
app.get('/api/lastfm/recent-tracks', (req, res) => {
  let method = 'user.getrecenttracks';
  let targetUrl =
    `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&extended=1&limit=200&from=1514764800`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top artists over the last 12 months
app.get('/api/lastfm/top-artists', (req, res) => {
  let method = 'user.gettopartists';
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&period=12month`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top 50 albums over last 12 months
app.get('/api/lastfm/top-albums', (req, res) => {
  let method = 'user.gettopalbums';
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&period=12month`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top 50 tracks over last 12 months
app.get('/api/lastfm/top-tracks', (req, res) => {
  let method = 'user.gettoptracks';
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&period=12month`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top artists over last week
app.get('/api/lastfm/weekly-artist-chart', (req, res) => {
  let method = 'user.getweeklyartistchart';
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top albums over last week
app.get('/api/lastfm/weekly-album-chart', (req, res) => {
  let method = 'user.getweeklyalbumchart';
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json`;

  request(targetUrl, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.body);
    }
  });
});

// Top tracks over last week
app.get("/api/lastfm/weekly-track-chart", (req, res) => {
  let method = "user.getweeklytrackchart";
  let targetUrl = `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${
    lastfm.user
  }&api_key=${lastfm.apiKey}&format=json`;

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