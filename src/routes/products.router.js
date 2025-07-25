import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Lista todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Devuelve un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
});

// Agrega un nuevo producto
router.post('/', async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Actualiza un producto existente
router.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const updatedFields = req.body;

    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if ('id' in updatedFields) {
      return res.status(400).json({ error: 'No se puede modificar el campo id' });
    }

    const updatedProduct = await productManager.updateProduct(pid, updatedFields);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});
// Elimina un producto por su ID
router.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const deleted = await productManager.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: `Producto con ID ${pid} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;