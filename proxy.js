var httpProxy = require('http-proxy');

httpProxy.createServer({
  target: {
    host: '192.168.2.3',
    port: 3000
  },
  ssl: {
    key: fs.readFileSync('../domain.key', 'utf-8'),
    cert: fs.readFileSync('../signed.crt', 'utf-8')
  }
}).listen(3000);
