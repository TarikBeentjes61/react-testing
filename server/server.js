require('dotenv').config();
const { getDB } = require('./config/db');
const app = require('./config/app');
const PORT = process.env.PORT || 3001;

let server;

getDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB:', err);
  });

module.exports = () => server;


