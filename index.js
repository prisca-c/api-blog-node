var http = require('http');
var fs = require('fs');
var url = require('url');
const querystring = require('querystring');

//create a server object:
http.createServer(function (req, res) {
  console.log("method" + req.method);
  res.writeHead(200, {'Content-Type': 'text/html'});

  let r = url.parse(req.url, true).pathname;
  let path = r.split('/');
  let cat = path[1]
  let directory = path[2]
  let file = path[3];

  /*let category = []
  fs.readdirSync('./data').forEach(file => {
    category.push(file);
  })*/

  if (r === `/${cat}` && directory === undefined) {
    if (req.method === "GET"){
      let info = []
      fs.readdirSync(`./data`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }
  }

  if (r === `/${cat}/${directory}`) {
    if (req.method === "GET"){
      let info = []
      fs.readdirSync(`./data/${directory}`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }

    if (req.method === "POST") {
      let body = "";

      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let timestamp = date + " " + time;

      let myfile = (date+time).replace(/[^a-zA-Z0-9]/g, '');
      let new_object = {
        "directory": directory,
        "timestamp": timestamp
      }

      console.log(timestamp);

      req.on('data', data => {
        body = querystring.parse(data.toString());
      });

      req.on('end', () => {
        let info = Object.assign(body,new_object)
        let str = JSON.stringify(info)
        console.log(str)
        fs.writeFile(`./data/${directory}/${myfile}.json`, str, function (err) {
          if (err) throw err;
          console.log('Saved!');
        })
      });
      res.end('ok');
    }
  }

  //console.log(r);
  //console.log(path);
  //console.log(file);
}).listen(8080); //the server object listens on port 8080