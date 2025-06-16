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

app.post('/api/pedidos', (req, res) => {
  const { cliente, productos } = req.body;

  if (!cliente || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos para procesar el pedido' });
  }

  const { nombre, direccion, telefono, correo } = cliente;

  // Verificar si el cliente ya existe por correo
  const buscarCliente = 'SELECT id_cliente FROM clientes WHERE correo = ?';
  db.query(buscarCliente, [correo], (err, results) => {
    if (err) {
      console.error('Error al buscar cliente:', err);
      return res.status(500).json({ error: 'Error al buscar el cliente' });
    }

    if (results.length > 0) {
      // Cliente encontrado: usar su ID
      const idCliente = results[0].id_cliente;
      insertarPedido(idCliente);
    } else {
      // Cliente NO existe: insertarlo
      const insertarCliente = `
        INSERT INTO clientes (nombre, direccion, telefono, correo)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertarCliente, [nombre, direccion, telefono, correo], (err, resultCliente) => {
        if (err) {
          console.error('Error al insertar cliente:', err);
          return res.status(500).json({ error: 'Error al registrar el nuevo cliente' });
        }
        const idCliente = resultCliente.insertId;
        insertarPedido(idCliente);
      });
    }

    // Función para insertar el pedido
    function insertarPedido(idCliente) {
      const insertarPedido = 'INSERT INTO pedidos (id_cliente) VALUES (?)';
      db.query(insertarPedido, [idCliente], (err, resultPedido) => {
        if (err) {
          console.error('Error al insertar pedido:', err);
          return res.status(500).json({ error: 'Error al registrar el pedido' });
        }

        const idPedido = resultPedido.insertId;
        const insertDetalle = 'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES ?';
        const detalles = productos.map(p => [idPedido, p.id_producto, p.cantidad, p.precio_unitario]);

        db.query(insertDetalle, [detalles], (err) => {
          if (err) {
            console.error('Error al insertar detalles del pedido:', err);
            return res.status(500).json({ error: 'Error al registrar los detalles del pedido' });
          }

          res.status(201).json({ mensaje: 'Pedido registrado exitosamente', id_pedido: idPedido });
        });
      });
    }
  });
});

// Obtener un producto por su ID
app.get('/api/productos/:id', (req, res) => {
  const idProducto = req.params.id;

  const sql = `
    SELECT 
      p.id_producto AS id,
      p.nombre,
      p.descripcion,
      p.precio,
      c.nombre_categoria AS categoria
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.id_producto = ?
  `;

  db.query(sql, [idProducto], (err, results) => {
    if (err) {
      console.error('Error al consultar el producto:', err);
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(results[0]);
  });
});



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
