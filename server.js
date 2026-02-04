const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', require('./routes'));
app.use(require('./routes/swagger'));


mongodb
  .initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
