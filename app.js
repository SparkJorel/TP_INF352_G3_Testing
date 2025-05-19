import express from 'express';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicleRoutes.js'; // Ensure the .js extension is included for ES modules

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);

app.listen(PORT, () => {
    console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});

export default app;