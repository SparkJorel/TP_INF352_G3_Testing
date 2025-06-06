import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoute.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/vehicles', vehicleRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});

export default app;