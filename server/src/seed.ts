import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialCategories, initialProducts } from './mockData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'pure_veda_db';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log(`[Seed] Connecting to MySQL at ${host}:${port} as ${user}...`);

  let connection;
  try {
    // 1. Initial connection without database to create it if needed
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true,
    });

    console.log(`[Seed] Creating database ${database} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${database}\`;`);

    // 2. Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`[Seed] Executing schema.sql migrations...`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
    }

    // 3. Clear existing seeded data
    console.log(`[Seed] Resetting and seeding categories & products...`);
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE order_items;');
    await connection.query('TRUNCATE TABLE orders;');
    await connection.query('TRUNCATE TABLE products;');
    await connection.query('TRUNCATE TABLE categories;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // 4. Insert Categories
    for (const cat of initialCategories) {
      await connection.query(
        'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
        [cat.id, cat.name, cat.slug]
      );
    }
    console.log(`[Seed] Inserted ${initialCategories.length} categories.`);

    // 5. Insert Products
    for (const prod of initialProducts) {
      await connection.query(
        `INSERT INTO products (id, category_id, name, slug, description, price, stock, image_url, rating) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          prod.category_id,
          prod.name,
          prod.slug,
          prod.description,
          prod.price,
          prod.stock,
          prod.image_url,
          prod.rating,
        ]
      );
    }
    console.log(`[Seed] Inserted ${initialProducts.length} products successfully.`);
    console.log(`[Seed] Database seeding completed successfully! ✨`);

    await connection.end();
  } catch (err: any) {
    console.error(`[Seed Warning] Could not seed MySQL (${err.code || err.message}).`);
    console.log(`[Seed Info] Don't worry! The application server has built-in In-Memory Mock Fallback that provides complete functionality out-of-the-box.`);
    if (connection) {
      await connection.end();
    }
  }
}

seed();
