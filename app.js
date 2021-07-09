const fs = require('fs');
const http = require('http');
const express = require('express');
// express is a function, which upon calling will add a bunch of methods to our app like below:
const app = express();

// HTTP Method for the get request - testing functionality of Express
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// }); // .json also sets the content-type to 'json' automatically, so we don't have to do it

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const toursJSON = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursJSON.length,
    data: {
      tours: toursJSON,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
