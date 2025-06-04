import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoutes.js';



const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});

export default app;