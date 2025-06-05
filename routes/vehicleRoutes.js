// routes/vehicleRoutes.js
import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const router = express.Router();
const db = new sqlite3.Database('./db/vehicles.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite :', err.message);
    } else {
        console.log('Connexion réussie à la base de données SQLite.');
    }
});

// Middleware
router.use(bodyParser.json());

// GET all vehicles
router.get("/", (req, res) => {
    db.all("SELECT * FROM vehicles;", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET vehicle by registration
router.get("/:registrationNumber", (req, res) => {
    const { registrationNumber } = req.params;
    db.get("SELECT * FROM vehicles WHERE registrationNumber = ?;", [registrationNumber], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Vehicle not found." });
        res.json(row);
    });
});

// POST create vehicle
router.post("/", (req, res) => {
    const { registrationNumber, make, model, year, rentalPrice } = req.body;
    if (!registrationNumber || !make || !model || !year || !rentalPrice) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const query = `INSERT INTO vehicles (registrationNumber, make, model, year, rentalPrice) VALUES (?, ?, ?, ?, ?);`;
    db.run(query, [registrationNumber, make, model, year, rentalPrice], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Vehicle created successfully." });
    });
});

// PUT update vehicle
router.put("/:registrationNumber", (req, res) => {
    const { registrationNumber } = req.params;
    const { make, model, year, rentalPrice } = req.body;
    if (!make || !model || !year || !rentalPrice) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const query = `UPDATE vehicles SET make = ?, model = ?, year = ?, rentalPrice = ? WHERE registrationNumber = ?;`;
    db.run(query, [make, model, year, rentalPrice, registrationNumber], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Vehicle not found." });
        res.json({ message: "Vehicle updated successfully." });
    });
});

// DELETE vehicle
router.delete("/:registrationNumber", (req, res) => {
    const { registrationNumber } = req.params;
    db.run("DELETE FROM vehicles WHERE registrationNumber = ?;", [registrationNumber], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Vehicle not found." });
        res.json({ message: "Vehicle deleted successfully." });
    });
});

// GET by registrationNumber or rentalPrice
router.get("/search", (req, res) => {
    const { registrationNumber, rentalPrice } = req.query;
    let query = "SELECT * FROM vehicles WHERE";
    const params = [];

    if (registrationNumber) {
        query += " registrationNumber = ?";
        params.push(registrationNumber);
    }

    if (rentalPrice) {
        if (params.length > 0) query += " OR";
        query += " rentalPrice = ?";
        params.push(rentalPrice);
    }

    if (params.length === 0) {
        return res.status(400).json({ error: "Provide at least registrationNumber or rentalPrice." });
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ message: "No vehicles found." });
        res.json(rows);
    });
});

export default router;
