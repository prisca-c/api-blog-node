let http = require('http');
let url = require('url');
let db = require('./db/connection');

db.createTable()
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
  let id = path[3];

  console.log(r)
  console.log(path)

  if (req.method === "GET") {
    if (r === `/${cat}` && path.length === 2) {
      let info = []
      // select all categories from db
      db.connectDb()
        .all(`SELECT name FROM category`, (err, rows) => {
          if (err) { throw err; }
          let data = rows
          data.forEach((row) => {
            info.push(row.name)
          })
          res.end(JSON.stringify(info));
        })
    }

    if (r === `/${cat}/${directory}` && path.length === 3) {
      let info = []
      let categoryId = 0
      // select all articles in category from db
      db.connectDb()
        .all(`SELECT id FROM category WHERE name = ?`, directory, (err, row) => {
          if (err) {
            throw err;
          }
          categoryId = row[0].id
          console.log(row)
          db.connectDb().all(`SELECT id, title FROM article WHERE category = ?`, categoryId, (err, rows) => {
            if (err) { throw err; }
            let data = rows
            if(rows.length > 0) {
              data.forEach((row) => {
                info.push(`[ID: ${row.id}] ${row.title}`)
              })
            } else {
              info.push('No articles found')
            }
            res.end(JSON.stringify(info));
          })
        })
    }

    if (r === `/${cat}/${directory}/${id}` && path.length === 4) {
      let categoryId = 0
      // select an article from db
      db.connectDb()
        .all(`SELECT id FROM category WHERE name = ?`, directory, (err, row) => {
          if (err) {
            throw err;
          }
          categoryId = row[0].id
          db.connectDb().all(`SELECT id, title, content, excerpt, date FROM article WHERE category = ? AND id = ?`, categoryId, id, (err, rows) => {
            if (err) { throw err; }
            res.end(JSON.stringify(Object.assign(rows[0], {category: directory})));
          })
        })
    }}

  if(req.method === "POST") {
    if (r === `/${cat}/${directory}` && path.length === 3) {
      let body = "";
      let myData = ""
      let categoryId = 0

      req.on('data', chunk => {
        body = chunk.toString();
        myData = JSON.parse(body)

        db.connectDb().all(`SELECT id FROM category WHERE name = ?`, myData.category, (err, row) => {
          if (err) { throw err; }
          categoryId = row[0].id
          db.insertData(myData.title, myData.content, myData.excerpt, categoryId , myData.timestamp)
        })})
      res.end('ok');
    }
    if (r === `/${cat}` && path.length === 2) {
      let body = "";
      let myData = ""
      req.on('data', chunk => {
        body = chunk.toString();
        myData = JSON.parse(body)
        db.insertCategory(myData.name)
      })
      res.end('ok');
    }
  }

  if(req.method === "DELETE") {
    if (r === `/${cat}/${directory}/${id}` && path.length === 4) {
      let categoryId = 0
      db.connectDb()
        .all(`SELECT id FROM category WHERE name = ?`, directory, (err, row) => {
          if (err) {
            throw err;
          }
          categoryId = row[0].id
          db.connectDb().run(`DELETE FROM article WHERE category = ? AND id = ?`, categoryId, id, (err) => {
            if (err) { throw err; }
            res.end('ok');
          })
        })
    }

    if (r === `/${cat}` && path.length === 2) {
      db.connectDb().run(`DELETE FROM category WHERE name = ?`, directory, (err) => {
        if (err) { throw err; }
        res.end('ok');
      })
    }
  }

  if(req.method === "OPTIONS") {
    res.end('ok');
  }
}).listen(8080); //the server object listens on port 8080