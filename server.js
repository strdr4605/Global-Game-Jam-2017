var express = require('express');
var app = express();

app.use(express.static('public'))
// app.use(express.static('phaser_tutorial_02'))

app.get('/', function(req, res) {
  res.send('index.html');
  // res.send('part9.html')
})

app.listen(3000, function() {
  console.log("App is on the port 3000!")
})
