const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function migrate() {
  const connection = await mysql.createConnection(config);
  const schemaPath = path.join(__dirname, '../../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await connection.query(schema);
    console.log('Database migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

migrate();
