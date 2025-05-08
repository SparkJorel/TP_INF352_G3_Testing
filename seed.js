const db = require('./db/database');

const vehicles = [
  ['ABC123', 'Toyota', 'Camry', 2020, 50],
  ['DEF456', 'Honda', 'Civic', 2021, 55],
  ['GHI789', 'Ford', 'Focus', 2019, 45],
  ['JKL012', 'Nissan', 'Altima', 2022, 60],
  ['MNO345', 'Chevrolet', 'Malibu', 2023, 65],
];

db.serialize(() => {
  vehicles.forEach(v => {
    db.run(`INSERT OR IGNORE INTO vehicles VALUES (?, ?, ?, ?, ?)`, v);
  });
  console.log("Données initiales insérées.");
});
