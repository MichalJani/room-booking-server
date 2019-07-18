const express = require('express');
const app = express();
const events = require('./events');

app.use(express.json({ extended: false }));

app.use('/api/events', events);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
