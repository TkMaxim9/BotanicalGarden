const express = require('express');
const router = express.Router();
const db = require('../db');

// CRUD для таблицы GardenSections
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM GardenSections';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  let sql = 'SELECT * FROM GardenSections WHERE SectionID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/', (req, res) => {
  let newSection = req.body;
  let sql = 'INSERT INTO GardenSections SET ?';
  db.query(sql, newSection, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.put('/:id', (req, res) => {
  let updatedSection = req.body;
  let sql = 'UPDATE GardenSections SET ? WHERE SectionID = ?';
  db.query(sql, [updatedSection, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.delete('/:id', (req, res) => {
  let sql = 'DELETE FROM GardenSections WHERE SectionID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
