const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all vehicles
router.get('/', (req, res) => {
  db.all('SELECT * FROM vehicles', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// GET vehicle by registration
router.get('/:registrationNumber', (req, res) => {
  const { registrationNumber } = req.params;
  db.get('SELECT * FROM vehicles WHERE registrationNumber = ?', [registrationNumber], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send("Véhicule non trouvé.");
    res.json(row);
  });
});

// POST create vehicle
router.post('/', (req, res) => {
  const { registrationNumber, make, model, year, rentalPrice } = req.body;
  db.run(`INSERT INTO vehicles VALUES (?, ?, ?, ?, ?)`,
    [registrationNumber, make, model, year, rentalPrice],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(201).json({ id: this.lastID });
    });
});

// PUT update vehicle
router.put('/:registrationNumber', (req, res) => {
  const { registrationNumber } = req.params;
  const { make, model, year, rentalPrice } = req.body;
  db.run(`UPDATE vehicles SET make=?, model=?, year=?, rentalPrice=? WHERE registrationNumber=?`,
    [make, model, year, rentalPrice, registrationNumber],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send("Mise à jour réussie.");
    });
});

// DELETE vehicle
router.delete('/:registrationNumber', (req, res) => {
  const { registrationNumber } = req.params;
  db.run('DELETE FROM vehicles WHERE registrationNumber = ?', [registrationNumber], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send("Suppression réussie.");
  });
});

// GET by price or registration
router.get('/search', (req, res) => {
  const { registrationNumber, rentalPrice } = req.query;
  let query = 'SELECT * FROM vehicles WHERE 1=1';
  let params = [];

  if (registrationNumber) {
    query += ' AND registrationNumber = ?';
    params.push(registrationNumber);
  }
  if (rentalPrice) {
    query += ' AND rentalPrice <= ?';
    params.push(rentalPrice);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

module.exports = router;
