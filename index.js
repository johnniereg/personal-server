const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const SpotifyWebApi = require('spotify-web-api-js');

let spotifyApi = new SpotifyWebApi();

require('dotenv').config();

const PORT = process.env.PORT || 8080
const app = express();

const lastfm = {
  user: process.env.LAST_FM_USER,
  apiKey: process.env.LAST_FM_API_KEY
};

const spotify = {
  client_id: process.env.SPOTIFY_CLIENT_ID,
  client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  redirect_uri: "https://morning-brushlands-94806.herokuapp.com/api/spotify/callback"
};

const stateKey = "spotify_auth_state";

const generateRandomString = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/', (req, res) => {
  res.send(`👻 💻`);
})

app.get('/api/spotify/login', (req, res) => {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  let scope = 'user-read-private user-read-email user-read-recently-played';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotify.client_id,
      scope: scope,
      redirect_uri: spotify.redirect_uri,
      state: state
    }));
});

app.get('/api/spotify/callback', (req, res) => {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        spotifyApi.setAccessToken(acces_token);

        const options = {
          url: 'https://api.spotify.com/v1/me/player/recently-played',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/api/spotify/refresh_token', (req, res) => {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

// LastFM Routes

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