// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');

// const auth = require('./index');

// // @route    GET api/calendars
// // @desc     Create a post
// // @access   Private
// router.get('/', auth, async (req, res) => {
//   try {
//     fs.readFile('credentials.json', (err, content) => {
//       if (err) return console.log('Error loading client secret file:', err);

//       auth.authorize(JSON.parse(content), listEvents);
//     });

//     function listEvents(auth) {
//       const calendar = google.calendar({ version: 'v3', auth });
//       calendar.events.list({
//         calendarId: 'primary',
//         timeMin: (new Date()).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',
//       }, (err, res) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         const events = res.data.items;
//         if (events.length) {
//           console.log('Upcoming 10 events:');
//           events.map((event, i) => {
//             const start = event.start.dateTime || event.start.date;
//             console.log(`${start} - ${event.summary}`);
//           });
//         } else {
//           console.log('No upcoming events found.');
//         }
//         res.json(post);
//       });
//     }

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;

