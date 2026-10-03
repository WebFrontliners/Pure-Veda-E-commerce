import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import { initialCategories, initialProducts, Category, Product, Order, OrderItem } from './mockData.js';

dotenv.config();

let pool: Pool | null = null;
let useMock = false;

// In-memory fallback state
let memoryCategories: Category[] = JSON.parse(JSON.stringify(initialCategories));
let memoryProducts: Product[] = JSON.parse(JSON.stringify(initialProducts));
let memoryOrders: Order[] = [];
let nextOrderId = 1001;

export async function initDb(): Promise<void> {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'pure_veda_db';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  // If DB password is not defined or DB_HOST is missing, we can still attempt, but handle failure gracefully
  try {
    const testPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });

    // Test connection
    const conn = await testPool.getConnection();
    await conn.ping();
    conn.release();

    pool = testPool;
    useMock = false;
    console.log(`[Database] Successfully connected to MySQL database: ${database} at ${host}:${port}`);
  } catch (err: any) {
    console.warn(`[Database] MySQL connection failed (${err.code || err.message}). Switching to robust In-Memory Mock Store.`);
    useMock = true;
    pool = null;
  }
}

export function isMockMode(): boolean {
  return useMock;
}

export function getPool(): Pool | null {
  return pool;
}

// Data Access Layer with transparent Fallback
export async function getCategories(): Promise<Category[]> {
  if (!useMock && pool) {
    try {
      const [rows] = await pool.query('SELECT id, name, slug FROM categories ORDER BY name ASC');
      return rows as Category[];
    } catch (error) {
      console.error('[Database Error] Falling back to mock categories', error);
    }
  }
  return memoryCategories;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!useMock && pool) {
    try {
      let sql = `
        SELECT p.*, c.name AS category_name, c.slug AS category_slug 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filters.category) {
        sql += ' AND (c.slug = ? OR c.id = ?)';
        params.push(filters.category, filters.category);
      }

      if (filters.search) {
        sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        const term = `%${filters.search}%`;
        params.push(term, term);
      }

      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        sql += ' AND p.price >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        sql += ' AND p.price <= ?';
        params.push(filters.maxPrice);
      }

      switch (filters.sort) {
        case 'price-asc':
          sql += ' ORDER BY p.price ASC';
          break;
        case 'price-desc':
          sql += ' ORDER BY p.price DESC';
          break;
        case 'rating':
          sql += ' ORDER BY p.rating DESC';
          break;
        case 'newest':
        default:
          sql += ' ORDER BY p.id DESC';
          break;
      }

      const [rows] = await pool.query(sql, params);
      return (rows as any[]).map(r => ({
        ...r,
        price: parseFloat(r.price),
        rating: parseFloat(r.rating),
      })) as Product[];
    } catch (error) {
      console.error('[Database Error] Falling back to mock products', error);
    }
  }

  // In-memory filter implementation
  let results = memoryProducts.map(p => {
    const cat = memoryCategories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_name: cat ? cat.name : 'General',
      category_slug: cat ? cat.slug : 'general',
    };
  });

  if (filters.category && filters.category !== 'all') {
    results = results.filter(
      p => p.category_slug === filters.category || String(p.category_id) === filters.category
    );
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(
      p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }

  if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      results.sort((a, b) => b.id - a.id);
      break;
  }

  return results;
}

export async function getProductByIdOrSlug(identifier: string): Promise<Product | null> {
  const isNumeric = /^\d+$/.test(identifier);

  if (!useMock && pool) {
    try {
      const sql = `
        SELECT p.*, c.name AS category_name, c.slug AS category_slug 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
        LIMIT 1
      `;
      const [rows] = await pool.query(sql, [identifier]);
      const arr = rows as any[];
      if (arr.length > 0) {
        return {
          ...arr[0],
          price: parseFloat(arr[0].price),
          rating: parseFloat(arr[0].rating),
        };
      }
      return null;
    } catch (error) {
      console.error('[Database Error] Falling back to mock product detail', error);
    }
  }

  const p = memoryProducts.find(item =>
    isNumeric ? item.id === parseInt(identifier, 10) : item.slug === identifier
  );
  if (!p) return null;
  const cat = memoryCategories.find(c => c.id === p.category_id);
  return {
    ...p,
    category_name: cat ? cat.name : 'General',
    category_slug: cat ? cat.slug : 'general',
  };
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  items: { product_id: number; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (!input.items || input.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  if (!useMock && pool) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let calculatedTotal = 0;
      const orderItemsToInsert: { product: any; quantity: number; price: number }[] = [];

      for (const item of input.items) {
        const [prodRows]: any = await conn.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
        if (prodRows.length === 0) {
          throw new Error(`Product ID ${item.product_id} not found`);
        }
        const product = prodRows[0];
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
        }

        const price = parseFloat(product.price);
        calculatedTotal += price * item.quantity;
        orderItemsToInsert.push({ product, quantity: item.quantity, price });

        // Update product stock
        await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      }

      // Insert Order
      const [orderRes]: any = await conn.query(
        'INSERT INTO orders (customer_name, customer_email, shipping_address, total_amount, status) VALUES (?, ?, ?, ?, ?)',
        [input.customer_name, input.customer_email, input.shipping_address, calculatedTotal, 'paid']
      );

      const orderId = orderRes.insertId;

      // Insert Order Items
      const createdItems: OrderItem[] = [];
      for (const oi of orderItemsToInsert) {
        const [itemRes]: any = await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
          [orderId, oi.product.id, oi.quantity, oi.price]
        );
        createdItems.push({
          id: itemRes.insertId,
          order_id: orderId,
          product_id: oi.product.id,
          quantity: oi.quantity,
          price_at_purchase: oi.price,
          product_name: oi.product.name,
          product_image: oi.product.image_url,
        });
      }

      await conn.commit();

      return {
        id: orderId,
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        shipping_address: input.shipping_address,
        total_amount: calculatedTotal,
        status: 'paid',
        created_at: new Date().toISOString(),
        items: createdItems,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // In-Memory Order Flow
  let total = 0;
  const createdItems: OrderItem[] = [];

  for (const item of input.items) {
    const prod = memoryProducts.find(p => p.id === item.product_id);
    if (!prod) {
      throw new Error(`Product with ID ${item.product_id} not found`);
    }
    if (prod.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}`);
    }

    prod.stock -= item.quantity;
    const price = prod.price;
    total += price * item.quantity;

    createdItems.push({
      id: Math.floor(Math.random() * 90000) + 1000,
      order_id: nextOrderId,
      product_id: prod.id,
      quantity: item.quantity,
      price_at_purchase: price,
      product_name: prod.name,
      product_image: prod.image_url,
    });
  }

  const newOrder: Order = {
    id: nextOrderId++,
    customer_name: input.customer_name,
    customer_email: input.customer_email,
    shipping_address: input.shipping_address,
    total_amount: Math.round(total * 100) / 100,
    status: 'paid',
    created_at: new Date().toISOString(),
    items: createdItems,
  };

  memoryOrders.push(newOrder);
  return newOrder;
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  if (!useMock && pool) {
    try {
      const [orderRows]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (orderRows.length === 0) return null;
      const order = orderRows[0];

      const [itemRows]: any = await pool.query(
        `SELECT oi.*, p.name AS product_name, p.image_url AS product_image 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      return {
        ...order,
        total_amount: parseFloat(order.total_amount),
        items: itemRows.map((r: any) => ({
          ...r,
          price_at_purchase: parseFloat(r.price_at_purchase),
        })),
      };
    } catch (err) {
      console.error('[Database Error] Falling back to memory order lookup', err);
    }
  }

  return memoryOrders.find(o => o.id === orderId) || null;
}

// Admin Data Access Methods
export async function getAllOrders(): Promise<Order[]> {
  if (!useMock && pool) {
    try {
      const [orderRows]: any = await pool.query('SELECT * FROM orders ORDER BY id DESC');
      const orders: Order[] = [];
      for (const order of orderRows) {
        const [itemRows]: any = await pool.query(
          `SELECT oi.*, p.name AS product_name, p.image_url AS product_image 
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        orders.push({
          ...order,
          total_amount: parseFloat(order.total_amount),
          items: itemRows.map((r: any) => ({
            ...r,
            price_at_purchase: parseFloat(r.price_at_purchase),
          })),
        });
      }
      return orders;
    } catch (err) {
      console.error('[Database Error] Falling back to memory orders', err);
    }
  }

  return [...memoryOrders].reverse();
}

export async function updateOrderStatus(orderId: number, status: 'pending' | 'paid' | 'shipped'): Promise<boolean> {
  if (!useMock && pool) {
    try {
      const [res]: any = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error('[Database Error] Falling back to memory order status update', err);
    }
  }

  const order = memoryOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    return true;
  }
  return false;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  if (!useMock && pool) {
    try {
      const [res]: any = await pool.query(
        `INSERT INTO products (category_id, name, slug, description, price, stock, image_url, rating) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.category_id,
          product.name,
          slug,
          product.description,
          product.price,
          product.stock,
          product.image_url,
          product.rating || 4.8,
        ]
      );
      return {
        ...product,
        id: res.insertId,
        slug,
        rating: product.rating || 4.8,
      };
    } catch (err) {
      console.error('[Database Error] Falling back to memory product add', err);
    }
  }

  const newId = memoryProducts.length > 0 ? Math.max(...memoryProducts.map(p => p.id)) + 1 : 1;
  const newProduct: Product = {
    ...product,
    id: newId,
    slug,
    rating: product.rating || 4.8,
  };
  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  if (!useMock && pool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'category_name' && key !== 'category_slug') {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      }
      if (fields.length > 0) {
        values.push(id);
        await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      return await getProductByIdOrSlug(String(id));
    } catch (err) {
      console.error('[Database Error] Falling back to memory product update', err);
    }
  }

  const prod = memoryProducts.find(p => p.id === id);
  if (!prod) return null;
  Object.assign(prod, updates);
  return prod;
}

export async function deleteProduct(id: number): Promise<boolean> {
  if (!useMock && pool) {
    try {
      const [res]: any = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error('[Database Error] Falling back to memory product delete', err);
    }
  }

  const index = memoryProducts.findIndex(p => p.id === id);
  if (index > -1) {
    memoryProducts.splice(index, 1);
    return true;
  }
  return false;
}

export async function getAdminStats() {
  const products = await getProducts();
  const orders = await getAllOrders();
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'pending' ? o.total_amount : 0), 0);
  const lowStockCount = products.filter(p => p.stock <= 12).length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders: orders.length,
    totalProducts: products.length,
    lowStockCount,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    paidOrders: orders.filter(o => o.status === 'paid').length,
  };
}
