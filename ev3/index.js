var ev3 = require('ev3dev-lang');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var rx = require('rx');
var spawn = require('child_process').spawn;

var commandSubject = new rx.Subject();

var app = express();
var jsonParser = bodyParser.json();

app.use(cors());
app.use(jsonParser);

app.get('/', function(req, res, next) {
  res.json({response: 'hello'});
})

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
var rightMotor = new ev3.Motor(ev3.OUTPUT_B);
var leftMotor = new ev3.Motor(ev3.OUTPUT_C);
var motors = [motor, leftMotor, rightMotor];
var driveMotors = [leftMotor, rightMotor];

function stop() {
  for(var i = 0; i < motors.length; ++i) {
    motors[i].stop();
  }
}

var commands = {
  shoot: function() {
    motor.start(-20);
    setTimeout(function() {
      motor.stop();
      motor.start(100);
      setTimeout(function() { motor.stop(); }, 2000);
    });
  },

  stop: function() {
    stop();
  },

  forward: function(options) {
    for(var i = 0; i < driveMotors.length; ++i) {
      driveMotors[i].start(100);
    }

    if(options.for) {
      setTimeout(stop, options.for * 1000);
    }
  },

  backward: function(options) {
    for(var i = 0; i < driveMotors.length; ++i) {
      driveMotors[i].start(-100);
    }

    if(options.for) {
      setTimeout(stop, options.for * 1000);
    }
  },

  turn: function(options) {
    var leftSpeed = options.direction === 'left' ? 75 : -75;
    var rightSpeed = options.direction === 'right' ? 75 : -75;

    leftMotor.start(leftSpeed);
    rightMotor.start(rightSpeed);
    setTimeout(stop, 1000);
  }
}

commandSubject.subscribe(function(command) {
  console.log(command);
  commands[command.type](command);
  spawn('aplay', ['ev3/roger.wav']);
});
