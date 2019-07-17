
const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const { readCredentials } = require('./auth')


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
    })
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data.items);
  }
})

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
        respondError(err)
        return;
      }
      respond(res);
    })
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
})

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
        respondError(err)
        return;
      }
      respond(res);
    })
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
})

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
        respondError(err)
        return;
      }
      respond(res);
    })
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).send({ message: 'Event has been deleted.' });
  }
})

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
        respondError(err)
        return;
      }
      respond(res);
    })
  }
  function respondError(calError) {
    res.status(calError.code).json(calError.errors[0]);
  }
  function respond(calRes) {
    res.status(calRes.status).json(calRes.data);
  }
})


module.exports = router;
