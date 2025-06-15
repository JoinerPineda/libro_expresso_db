require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL.');
});

// Obtener todas las categorías
app.get('/api/categorias', (req, res) => {
  const sql = 'SELECT * FROM categorias';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las categorías' });
    }
    res.json(results);
  });
});

// Obtener productos (por categoría o todos)
app.get('/api/productos', (req, res) => {
  const categoria = req.query.categoria;

  let sql = `
    SELECT 
      p.id_producto AS id,
      p.nombre,
      p.descripcion,
      p.precio,
      c.nombre_categoria AS categoria
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
  `;

  const params = [];

  if (categoria) {
    sql += ' WHERE c.id_categoria = ?';
    params.push(categoria);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error al consultar productos:', err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
