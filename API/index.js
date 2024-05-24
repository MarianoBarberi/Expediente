const express = require('express');
const app = express();
const router = require('./routes/route');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

app.get('/api', (req, res) => {
    res.json({ "message": "mundo"});
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});