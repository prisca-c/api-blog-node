let http = require('http');
let fs = require('fs');
let url = require('url');
const querystring = require('querystring');

//create a server object:
http.createServer(function (req, res) {
  console.log("method" + req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.writeHead(200, {'Content-Type': 'text/html'});

  let r = url.parse(req.url, true).pathname;
  let path = r.split('/');
  let cat = path[1]
  let directory = path[2]
  let file = path[3];
  let nameFile = ""

  console.log(r)
  console.log(path)

  if (req.method === "GET") {

    if (r === `/${cat}` && path.length === 2) {
      let info = []
      fs.readdirSync(`./data`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }

    if (r === `/${cat}/${directory}` && path.length === 3) {
      let info = []
      fs.readdirSync(`./data/${directory}`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }

    if (r === `/${cat}/${directory}/${file}` && path.length === 4) {
      fs.readFile(`./data/${directory}/${file}`, 'utf8', function (err, data) {
        if (err) throw err;
        res.end(data);
      })
    }
  }

  if(req.method === "POST") {
    if (r === `/${cat}/${directory}` && path.length === 3) {
      let body = "";
      let myData = ""

      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      let myTimeStampFile = (date + time).replace(/[^a-zA-Z0-9]/g, '');

      req.on('data', chunk => {
        body = chunk.toString();
        myData = JSON.parse(body)
        console.log(myData)

        console.log("woop")
        console.log(myData)
        console.log("MTSF:" + myTimeStampFile)

        if (myData.id === "") {
          nameFile = myTimeStampFile + "_" + myData.title.replace(/[^a-zA-Z0-9]/g, '_');
          console.log("no_id " + nameFile)
        } else if (myData.id !== "") {
          nameFile = myTimeStampFile + "_" + (myData.id);
          console.log("id " + nameFile)
        }
      })

      req.on('end', () => {
        fs.writeFile(`./data/${directory}/${nameFile}.json`, JSON.stringify(myData), function (err) {
          if (err) throw err;
          console.log('Saved!');
        })
      });
      res.end('ok');
    }
  }

  if(req.method === "OPTIONS") {
    res.end('ok');
  }
}).listen(8080); //the server object listens on port 8080