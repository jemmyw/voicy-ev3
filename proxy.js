var httpProxy = require('http-proxy');
var fs = require('fs');

var proxy = httpProxy.createServer({
  target: {
    host: '192.168.2.3',
    port: 3000
  },
  ssl: {
    key: fs.readFileSync('../domain.key', 'utf-8'),
    cert: fs.readFileSync('../signed.crt', 'utf-8')
  }
});

proxy.listen(3000);

proxy.on('error', function(err) {
  console.log('error', err);
});

proxy.on('proxyRes', function() {
  console.log('proxyRes');
});
