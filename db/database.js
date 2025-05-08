const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/vehicles.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS vehicles (
    registrationNumber TEXT PRIMARY KEY,
    make TEXT,
    model TEXT,
    year INTEGER,
    rentalPrice REAL
  )`);
});

module.exports = db;
