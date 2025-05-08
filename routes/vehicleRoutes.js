const express = require('express');
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); // Import sqlite3
const bodyParser = require("body-parser");
const db = require('../db/database');
// Middleware pour parser le JSON
router.use(bodyParser.json());


// GET all vehicles
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Vehicles';
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
      } else {
        res.status(200).json(rows);
      }
    });
  });

// GET vehicle by registration


// POST create vehicle


// Connect to SQLite database


// PUT - Mettre à jour un véhicule
router.put("/:registrationNumber", (req, res) => {
    const { registrationNumber } = req.params;
    const { make, model, year, rentalPrice } = req.body;

    if (!make || !model || !year || !rentalPrice) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        UPDATE vehicles 
        SET make = ?, model = ?, year = ?, rentalPrice = ?
        WHERE registrationNumber = ?;
    `;

    db.run(query, [make, model, year, rentalPrice, registrationNumber], function(err) {
        if (err) {
            return res.status(500).json({ error: "Database error: " + err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Vehicle not found." });
        }

        res.json({ message: "Vehicle updated successfully." });
    });
});


// DELETE vehicle


// GET by price or registration

module.exports = router;