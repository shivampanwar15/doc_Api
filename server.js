import express from 'express';
import bodyParser from 'body-parser';
import appointment from './routes/appointment.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());




app.use('/', appointment);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Doctor availability API listening at http://localhost:${port}`);
});
