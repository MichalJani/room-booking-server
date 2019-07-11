const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


// Load client secrets from a local file.
function readCredentials(callback) {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), callback);
    // authorize(JSON.parse(content), insertEvent);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// @route    GET api/events
// @desc     Get all events
// @access   Private
router.get('/', (req, res) => {
  readCredentials(listEvents);
  function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        respondError(err);
        return;
      }
      respond(res);
    });
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data.items);
  }
});

// @route    POST api/events
// @desc     Add new event
// @access   Private
router.post('/', (req, res) => {
  readCredentials(insertEvent);
  function insertEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: req.body,
    }, function (err, res) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        respondError(err);
        return;
      }
      respond(res);
    });
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
});

// @route    GET api/events/:id
// @desc     Get event by id
// @access   Private
router.get('/:id', (req, res) => {
  readCredentials(getEvent);
  function getEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.get({
      auth: auth,
      calendarId: 'primary',
      eventId: req.params.id,
    }, function (err, res) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        respondError(err);
        return;
      }
      respond(res);
    });
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
});

// @route    DELETE api/events/:id
// @desc     Delete event by id
// @access   Private
router.delete('/:id', (req, res) => {
  readCredentials(deleteEvent);
  function deleteEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.delete({
      auth: auth,
      calendarId: 'primary',
      eventId: req.params.id,
    }, function (err, res) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        respondError(err);
        return;
      }
      respond(res);
    });
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).send({ message: 'Event has been deleted.' });
  }
});

// @route    PUT api/events
// @desc     Update event
// @access   Private
router.put('/:id', (req, res) => {
  readCredentials(updateEvent);
  function updateEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.update({
      auth: auth,
      calendarId: 'primary',
      eventId: req.params.id,
      resource: req.body,
    }, function (err, res) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        respondError(err);
        return;
      }
      respond(res);
    });
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
});

module.exports = router;
