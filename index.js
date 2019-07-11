const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
// const path = require('path');

const app = express();
app.use(express.json({ extended: false }));

// app.use('/api/calendars', require('./calendars'));
app.use('/api/events', require('./events'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
