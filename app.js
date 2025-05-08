const express = require('express');
const bodyParser = require('body-parser');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);

app.listen(PORT, () => {
  console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});
