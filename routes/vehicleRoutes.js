const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { Vehicle } = require('../models/vehicle');


// GET all vehicles


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


// PUT update vehicle


// DELETE vehicle


// GET by price or registration


module.exports = router;


