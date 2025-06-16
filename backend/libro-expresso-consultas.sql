create database libro_expresso_db;

-- Tabla de categorías
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(50) NOT NULL
);

-- Tabla de productos
CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(8,2) NOT NULL,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  telefono VARCHAR(20) NOT NULL
);

CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_producto INT,
  cantidad INT NOT NULL,
  recio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

INSERT INTO categorias (nombre_categoria) VALUES
('Cafés'),
('Bebidas frías'),
('Postres'),
('Snacks');

-- Cafés
INSERT INTO productos (nombre, descripcion, precio, id_categoria) VALUES
('Espresso', 'Intenso y aromático.', 5000, 1),
('Café Latte', 'Suave con leche vaporizada.', 6500, 1),
('Capuccino', 'Cremoso y con espuma.', 6000, 1);

-- Bebidas fríasclientesclientes
INSERT INTO productos (nombre, descripcion, precio, id_categoria) VALUES
('Cold Brew', 'Café frío artesanal.', 7000, 2),
('Limonada de panela', 'Refrescante y natural.', 4500, 2);

-- Postres
INSERT INTO productos (nombre, descripcion, precio, id_categoria) VALUES
('Tarta de chocolate', 'Hecha en casa.', 8000, 3),
('Cheesecake de mora', 'Cremosa y fresca.', 8500, 3);

-- Snacks
INSERT INTO productos (nombre, descripcion, precio, id_categoria) VALUES
('Panini de jamón y queso', 'Crocante y sabroso.', 9000, 4),
('Tostadas con aguacate', 'Saludables y deliciosas.', 0, 4);


-- Modificar productos
UPDATE productos SET precio = 7500 WHERE id_producto = 2;

-- Eliminar producto
DELETE FROM productos WHERE id_producto = 9;