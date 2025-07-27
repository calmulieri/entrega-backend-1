import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

//Crea un nuevo carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});


// Lista los productos del carrito
router.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);

    if (isNaN(cid)) {
      return res.status(400).json({ error: 'ID de carrito inválido' });
    }

    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
      return res.status(400).json({ error: 'ID de carrito o producto inválido' });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;