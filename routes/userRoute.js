import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const router = express.Router();
router.use(bodyParser.json());

// Connexion à la BDD
const db = new sqlite3.Database('./db/vehicles.db');

// Créer un utilisateur
router.post('/', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required.' });
    }

    const sql = `INSERT INTO user (name, password) VALUES (?, ?)`;
    db.run(sql, [name, password], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(500).json({ error: 'Duplicate username.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name });
    });
});

// Mettre à jour un utilisateur
router.put('/:id', (req, res) => {
    const { name, password } = req.body;
    const { id } = req.params;

    const sql = `UPDATE user SET name = ?, password = ? WHERE id = ?`;
    db.run(sql, [name, password, id], function(err) {
        if (err) {
            
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ message: 'User updated successfully.' });
        
          
    });
});

// Connexion
router.post('/login', (req, res) => {
    const { name, password } = req.body;

    const sql = `SELECT * FROM user WHERE name = ? AND password = ?`;
    db.get(sql, [name, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (err && err.message.includes('UNIQUE')) {
            return res.status(500).json({ error: 'Duplicate username.' });
          }
        if (!row) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.json({ message: 'Login successful!', user: row });
    });

   
      
});

export default router;