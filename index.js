var http = require('http');
var fs = require('fs');
var url = require('url');
const querystring = require('querystring');

//create a server object:
http.createServer(function (req, res) {
  console.log("method" + req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  let r = url.parse(req.url, true).pathname;
  let path = r.split('/');
  let cat = path[1]
  let directory = path[2]
  let file = path[3];
  let nameFile = ""

  /*let category = []
  fs.readdirSync('./data').forEach(file => {
    category.push(file);
  })*/

  if (r === `/${cat}` && path.length === 2) {
    if (req.method === "GET"){
      let info = []
      fs.readdirSync(`./data`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }
  }

  if (r === `/${cat}/${directory}` && path.length === 3) {
    if (req.method === "GET"){
      let info = []
      fs.readdirSync(`./data/${directory}`).forEach(file => {
        info.push(file);
      })
      res.end(JSON.stringify(info));
    }

    if (req.method === "POST") {
      res.writeHead(200, {'Content-Type': 'application/json'})
      let body = "";
      let myData = ""

      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      let myTimeStampFile = (date+time).replace(/[^a-zA-Z0-9]/g, '');

      req.on('data', chunk => {
        body = chunk.toString();
        myData = JSON.parse(body)
        console.log(myData)

        console.log("woop")
        console.log(myData)
        console.log("MTSF:" + myTimeStampFile)

        if(myData.id === ""){
          nameFile = myTimeStampFile + "_" + myData.title.replace(/[^a-zA-Z0-9]/g, '_');
          console.log("no_id " + nameFile)
        } else if (myData.id !== "") {
          nameFile = myTimeStampFile + "_" + (myData.id);
          console.log("id " + nameFile)
        }
      });

      req.on('end', () => {
        fs.writeFile(`./data/${directory}/${nameFile}.json`, JSON.stringify(myData), function (err) {
          if (err) throw err;
          console.log('Saved!');
        })
      });
      res.end('ok');
    }
  }

  if (r === `/${cat}/${directory}/${file}` && path.length === 4) {
    if (req.method === "GET"){
      let info = []
      fs.readFile(`./data/${directory}/${file}`, 'utf8', function (err, data) {
        if (err) throw err;
        res.end(data);
      })
    }
  }
  
}).listen(8080); //the server object listens on port 8080