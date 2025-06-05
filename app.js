import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicleRoutes.js'; // Ensure the .js extension is included for ES modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'interface')));



app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);

app.listen(PORT, () => {
    console.log(`API Vehicle en écoute sur http://localhost:${PORT}`);
});

export default app;