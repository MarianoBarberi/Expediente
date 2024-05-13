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

const port = 5000;
app.listen(port, () => console.log('Listening on port ' + port));

