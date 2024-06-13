const express = require('express');
const router = express.Router();
const db = require('../db');

function checkAdmin(req, res, next) {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Доступ запрещен');
  }
  next();
}

// CRUD для таблицы Plants
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM Plants';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  let sql = 'SELECT * FROM Plants WHERE PlantID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/', checkAdmin, (req, res) => {
  let newPlant = req.body;
  let sql = 'INSERT INTO Plants SET ?';
  db.query(sql, newPlant, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.put('/:id', (req, res) => {
  let updatedPlant = req.body;
  let sql = 'UPDATE Plants SET ? WHERE PlantID = ?';
  db.query(sql, [updatedPlant, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.delete('/:id', checkAdmin, (req, res) => {
  let sql = 'DELETE FROM Plants WHERE PlantID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
