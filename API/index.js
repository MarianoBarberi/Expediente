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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});