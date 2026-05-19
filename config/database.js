// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs   = require('fs');
const path = require('path');

function getSslConfig() {
  if (process.env.DB_SSL_CA) {
    return { ssl: { ca: process.env.DB_SSL_CA, rejectUnauthorized: true } };
  }
  if (process.env.DB_SSL_CA_BASE64) {
    const ca = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8');
    return { ssl: { ca, rejectUnauthorized: true } };
  }
  return { ssl: { rejectUnauthorized: false } };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:           process.env.DB_HOST,
    port:           parseInt(process.env.DB_PORT) || 3306,
    dialect:        'mysql',
    logging:        false,
    dialectOptions: getSslConfig()
  }
);

sequelize.authenticate()
  .then(() => console.log('Conexion a MySQL establecida'))
  .catch(err => console.error('Error conectando:', err.message));

module.exports = sequelize;