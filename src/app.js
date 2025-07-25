//Inicio de app.js
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json()); // parsea json
app.use(express.urlencoded({ extended: true })); // parse formulario

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servidor 8080
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});