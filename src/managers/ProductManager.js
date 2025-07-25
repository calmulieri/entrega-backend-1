import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Para poder usar __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta por defecto de productos
const filePath = path.join(__dirname, '../data/products.json');

export default class ProductManager {
  constructor(path = filePath) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return []; // Si el archivo no existe o está vacío
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(prod => prod.id === id);
  }

  async addProduct(productData) {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    const missingFields = requiredFields.filter(field => !productData.hasOwnProperty(field));

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
    }

    const products = await this.getProducts();

    const newId = products.length > 0
      ? Math.max(...products.map(p => typeof p.id === 'number' ? p.id : 0)) + 1
      : 1;

    const newProduct = {
      id: newId,
      status: true,
      thumbnails: [],
      ...productData
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(prod => prod.id === id);
    if (index === -1) return null;

    // No modificar el id
    products[index] = { ...products[index], ...updatedFields, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(prod => prod.id !== id);
    if (filtered.length === products.length) return false; // No se eliminó

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}