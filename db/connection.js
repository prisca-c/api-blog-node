const sqlite3 = require('sqlite3').verbose();

// create a database sqlite
let db = ""

const connectDb = () => {
  return new sqlite3.Database('./db/api-blog.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the api-blog database.');
    }
  });
}

const createTable = () => {
  db = connectDb()
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS article (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      category INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (category) REFERENCES category (id)
    )`);
  });
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
  })
  db.close();
}

const insertData = (title, content, excerpt, category, date) => {
  db = connectDb()
  db.run(`INSERT INTO article (title, content, excerpt, category, date) VALUES (?, ?, ?, ?, ?)`,
    [title, content, excerpt, category, date], function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Save`);
  });
  db.close();
}

exports.createTable = createTable;
exports.connectDb = connectDb;
exports.insertData = insertData;

