const express = require('express');
const ProductManager = require('../Managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager('src/data/products.json');

// GET /api/products/
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// POST /api/products/
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const newProduct = await productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    });

    res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const deleted = await productManager.deleteProduct(pid);
    if (deleted) {
        res.json({ message: 'Producto eliminado' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;
