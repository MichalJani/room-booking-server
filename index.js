const express = require('express');
const app = express();
<<<<<<< HEAD
app.use(express.json({ extended: false }));

app.use('/api/events', require('./events'));
=======
const events = require('./events');

app.use(express.json({ extended: false }));

app.use('/api/events', events);
>>>>>>> exp

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
