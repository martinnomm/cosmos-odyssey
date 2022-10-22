const express = require('express');
const app = express();
const port = 3001;
const unirest = require("unirest");
const cors = require("cors");

app.use(cors())

app.get('/api/test', (req, res) => {
  const request = unirest("GET", "https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices")
  request.headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })
  request.end(function(response) {
    if (response.error) throw new Error(response.error)
    console.log(response.body)
    res.json(response.body)
  })
})
// app.get('/api/associations/:word', (req, res) => {
//   const request = unirest("GET", "https://twinword-word-associations-v1.p.rapidapi.com/associations/");
//   request.query({ "entry": req.params.word });
//   request.headers({
//     "x-rapidapi-host": "twinword-word-associations-v1.p.rapidapi.com",
//     "x-rapidapi-key": "YOUR_RAPID_API_KEY_GOES_HERE",
//     "useQueryString": true
//   });
//   request.end(function (response) {
//     if (response.error) throw new Error(response.error);
//     res.json(response.body.associations_scored || {});
//   });
// });

app.use(function(req, res){
  res.status(404);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});