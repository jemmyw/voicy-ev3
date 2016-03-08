var ev3 = require('ev3dev-lang');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var rx = require('rx');

var commandSubject = new rx.Subject();

var app = express();
var jsonParser = bodyParser.json();

app.use(cors());
app.use(jsonParser);

app.post('/command', function(req, res, next) {
  var command = req.body;
  console.log(command);
  commandSubject.onNext(command);
  res.json({response: 'ok'});
});

http.createServer(app).listen(3000, function() {
  console.log('listening on port 3000');
});

var motor = new ev3.MediumMotor(ev3.OUTPUT_A);
motor.stop();

commandSubject.subscribe(function(command) {
  console.log(command);
  if(command.type === 'shoot') {
    motor.start(50);
    setTimeout(function() { motor.stop(); }, 2000);
  }
});
