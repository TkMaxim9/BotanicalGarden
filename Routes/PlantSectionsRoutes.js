const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');


// CRUD для таблицы PlantSection
router.get('/', (req, res) => {
  const sql = `
        SELECT ps.PlantSectionID, p.Name, p.Family, p.Origin, p.Description, ps.DatePlanted, gs.SectionName
        FROM PlantSection ps
        JOIN Plants p ON ps.PlantID = p.PlantID
        JOIN GardenSections gs ON ps.SectionID = gs.SectionID
        ORDER BY ps.DatePlanted DESC
    `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  let sql = 'SELECT * FROM PlantSection WHERE PlantSectionID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/', (req, res) => {
  let newPlantSection = req.body;
  console.log(req.body);
  let sql = 'INSERT INTO PlantSection SET ?';
  db.query(sql, newPlantSection, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.put('/:id', (req, res) => {
  let updatedPlantSection = req.body;
  let sql = 'UPDATE PlantSection SET ? WHERE PlantSectionID = ?';
  db.query(sql, [updatedPlantSection, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.delete('/:id', (req, res) => {
  let sql = 'DELETE FROM PlantSection WHERE PlantSectionID = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
