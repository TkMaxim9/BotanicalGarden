const mysql = require('mysql2');

// Настройка соединения с базой данных
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3392Mm!!',
  database: 'BotanicalGarden'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

module.exports = db;