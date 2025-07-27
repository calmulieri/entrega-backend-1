import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Para compatibilidad con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, '../data/carts.json');

export default class CartManager {
  constructor(path = cartsPath) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0
      ? Math.max(...carts.map(c => typeof c.id === 'number' ? c.id : 0)) + 1
      : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      // Si ya existe el producto en el carrito, aumentar cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}