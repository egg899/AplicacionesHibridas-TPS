import express from 'express';
import path from 'path';

import usuariosRoute from './routes/usuariosRoute.js'; // Correct
import guitaristRoute from './routes/guitaristsRoute.js'; // Correct
import albumsRoute from './routes/albumsRoute.js'; // Correct

import validateBody from './validation.js';
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Middleware to parse JSON request bodies
app.use(express.json());


app.use(validateBody);

//console.log(guitaristRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', "index.html"));
});

app.use('/usuarios', usuariosRoute);
app.use('/guitarristas', guitaristRoute);
app.use('/albums', albumsRoute);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




