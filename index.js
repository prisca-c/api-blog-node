var http = require('http');
var fs = require('fs');
var url = require('url');

//create a server object:
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  let r = url.parse(req.url, true).pathname;
  let q = url.parse(req.url, true).query;

  if (r === '/category') {
    if(!q.category) {
      let category = []
      fs.readdir('./data', function (err, files) {
        if (err) {
          res.end('Unable to read directory:' + err);
        } else {
          files.forEach(function (file) {
            category.push(file)
          });
          res.end(JSON.stringify(category));
        }
      })
    } else {
      fs.readdir(`./data/${q.category}`, function(err, files) {
        if (err) {
          res.end('Unable to scan directory: ' + err);
        }
        res.end(JSON.stringify(files));
      })
    }
  }
}).listen(8080); //the server object listens on port 8080