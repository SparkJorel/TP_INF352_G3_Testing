import express from 'express';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoute.js'; // Corrigé

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);
app.use('/users', userRoutes);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});

export default app;