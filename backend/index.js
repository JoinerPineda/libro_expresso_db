require('dotenv').config(); // Importar dotenv primero
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Leer variables de entorno
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL.');
});

// Endpoint: categorías
app.get('/categorias', (req, res) => {
  const sql = 'SELECT * FROM categorias';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las categorías' });
    }
    res.json(results);
  });
});

// Endpoint: productos
app.get('/productos', (req, res) => {
  const sql = `
    SELECT p.id_producto, p.nombre, p.descripcion, p.precio, c.nombre_categoria
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
