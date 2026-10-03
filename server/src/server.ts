import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDb,
  isMockMode,
  getCategories,
  getProducts,
  getProductByIdOrSlug,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  addProduct,
  updateProduct,
  deleteProduct,
  getAdminStats,
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health & Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isMockMode() ? 'in-memory-fallback' : 'mysql-connected',
    service: 'Pure Veda E-commerce API',
  });
});

// Categories API
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Products API
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;

    const filters = {
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
      maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
    };

    const products = await getProducts(filters);
    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Single Product API
app.get('/api/products/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const product = await getProductByIdOrSlug(identifier);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Create Order API
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { customer_name, customer_email, shipping_address, items } = req.body;

    if (!customer_name || !customer_email || !shipping_address) {
      return res.status(400).json({ error: 'Please provide customer name, email, and shipping address' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const order = await createOrder({
      customer_name,
      customer_email,
      shipping_address,
      items,
    });

    res.status(201).json({
      message: 'Order created successfully!',
      order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message || 'Failed to place order' });
  }
});

// Single Order API
app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ================= ADMIN API ENDPOINTS ================= //

// Admin Stats
app.get('/api/admin/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Admin All Orders
app.get('/api/admin/orders', async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!['pending', 'paid', 'shipped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be pending, paid, or shipped.' });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully', status });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin Create Product
app.post('/api/admin/products', async (req: Request, res: Response) => {
  try {
    const { category_id, name, description, price, stock, image_url, rating } = req.body;
    if (!category_id || !name || !price || stock === undefined || !image_url) {
      return res.status(400).json({ error: 'Please provide category_id, name, price, stock, and image_url' });
    }

    const newProduct = await addProduct({
      category_id: parseInt(category_id, 10),
      name,
      slug: '',
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image_url,
      rating: rating ? parseFloat(rating) : 4.8,
    });

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error: any) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Admin Update Product
app.put('/api/admin/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const updates = req.body;
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);
    if (updates.category_id !== undefined) updates.category_id = parseInt(updates.category_id, 10);

    const updated = await updateProduct(productId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin Delete Product
app.delete('/api/admin/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const deleted = await deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start Server
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🌿 Pure Veda API server running on http://localhost:${PORT}`);
    console.log(`📦 Mode: ${isMockMode() ? 'In-Memory Fallback (Immediate)' : 'MySQL Connected'}`);
  });
}

start();
