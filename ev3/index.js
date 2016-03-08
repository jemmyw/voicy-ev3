var ev3 = require('ev3dev-lang');
var http = require('http');
var rx = require('rx');

var commandSubject = new rx.Subject();

http.createServer(function(req, res) {
  var data = '';

  req.setEncoding('utf-8');
  req.on('data', function(chunk) {
    data = data + chunk;
  })

  req.on('end', function() {
    try {
      var command = JSON.parse(data);
      commandSubject.onNext(command);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({response: 'ok'}));
    } catch(err) {
      res.writeHead(500);
      res.end('error');
    }
  })
}).listen(3000);

var motor = new ev3.MediumMotor(ev3.OUTPUT_A);
motor.stop();

commandSubject.subscribe(function(command) {
  if(command.type === 'shoot') {
    motor.start(50);
    setTimeout(function() { motor.stop(); }, 2000);
  }
});
