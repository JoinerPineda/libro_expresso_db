const BASIC_URL = 'http://localhost:3000/api';
const form = document.getElementById('form-domicilios');
let productosAgregados = [];
let productosDisponibles = [];


function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}

// Mostrar/ocultar menú interactivo de productos
function toggleOpcionesMenu() {
  const opciones = document.getElementById('opciones-menu');
  opciones.style.display = opciones.style.display === 'block' ? 'none' : 'block';
}

// Carrusel de imágenes
let indiceActual = 0;
const items = document.querySelectorAll('.carrusel-item');

function mostrarImagen(indice) {
  if (indice >= items.length) indiceActual = 0;
  else if (indice < 0) indiceActual = items.length - 1;
  else indiceActual = indice;

  items.forEach((item, i) => {
    item.classList.toggle('activo', i === indiceActual);
  });
}

function moverCarrusel(direccion) {
  mostrarImagen(indiceActual + direccion);
}

setInterval(() => {
  moverCarrusel(1); // Avanza una imagen hacia la derecha
}, 5000); // Cada 5 segundos

document.addEventListener('DOMContentLoaded', async () => {
  mostrarImagen(indiceActual);
  await cargarCategorias();
});

function toggleDomicilios() {
  const seccion = document.getElementById('domicilios');
  seccion.classList.toggle('domicilios-visible');
  seccion.classList.toggle('domicilios-oculto');
}

// Cargar categorías y productos al inicio
async function cargarCategorias() {
  try {
    const res = await fetch(BASIC_URL + '/categorias');
    const categorias = await res.json();

    const selectCategoria = document.getElementById('categoria');
    const contenedorMenu = document.getElementById('opciones-menu');

    categorias.forEach(cat => {
      // Agregar opciones al select
      const option = document.createElement('option');
      option.value = cat.id_categoria;
      option.textContent = cat.nombre_categoria;
      selectCategoria.appendChild(option);

      // Menú interactivo de carta
      const divCat = document.createElement('div');
      divCat.className = 'categoria';
      divCat.textContent = cat.nombre_categoria;
      divCat.onclick = () => mostrarSubmenu(cat.id_categoria);
      contenedorMenu.appendChild(divCat);

      const ul = document.createElement('ul');
      ul.className = 'submenu';
      ul.id = 'submenu-' + cat.id_categoria;

      contenedorMenu.appendChild(ul);
    });
  } catch (e) {
    console.error('Error cargando categorías:', e);
  }
}

function mostrarSubmenu(categoria) {
  const submenus = document.querySelectorAll('.submenu');
  submenus.forEach(menu => {
    if (menu.id === 'submenu-' + categoria) {
      if (menu.childElementCount === 0) {
        cargarProductosPorCategoria(categoria, menu);
      }
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    } else {
      menu.style.display = 'none';
    }
  });
}

async function cargarProductosPorCategoria(categoria, contenedor) {
  try {
    let url = BASIC_URL + "/productos";
    if (categoria) {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    const res = await fetch(url);
    const productos = await res.json();
    contenedor.innerHTML = '';

    productosDisponibles = [...productos];

    productos.forEach(prod => {
      const li = document.createElement('li');
      li.textContent = `${prod.nombre} - $${prod.precio}`;
      contenedor.appendChild(li);
    });

    if (productos.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No hay productos disponibles en esta categoría.';
      contenedor.appendChild(li);
    }
  } catch (e) {
    console.error('Error al cargar productos:', e);
  }
}

// Formulario dinámico: productos según categoría
const selectCategoria = document.getElementById('categoria');
const selectProducto = document.getElementById('producto');
const agregarBtn = document.getElementById('agregar-producto');
const listaPedido = document.getElementById('lista-pedido');
const cantidadInput = document.getElementById('cantidad');

selectCategoria.addEventListener('change', async () => {
  const categoria = selectCategoria.value;
  selectProducto.innerHTML = '';
  if (!categoria) {
    selectProducto.disabled = true;
    return;
  }

  try {
    const res = await fetch(`${BASIC_URL}/productos?categoria=${encodeURIComponent(categoria)}`);
    const productos = await res.json();

    selectProducto.disabled = false;
    productos.forEach(prod => {
      const option = document.createElement('option');
      option.value = prod.id;
      option.textContent = prod.nombre;
      selectProducto.appendChild(option);
    });
  } catch (e) {
    console.error('Error cargando productos:', e);
  }
});

// obtener producto por su id
async function obtenerProductoPorId(id) {
  try {
    const res = await fetch(`${BASIC_URL}/productos/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return await res.json();
  } catch (e) {
    console.error('Error obteniendo producto:', e);
    return null;
  }
}

// Agregar producto al pedido
agregarBtn.addEventListener('click', async () => {
  const idProducto = selectProducto.value;
  const cantidad = parseInt(cantidadInput.value);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert('❌ Cantidad inválida. Debe ser un número mayor a 0.');
    return;
  }

  const producto = await obtenerProductoPorId(idProducto);

  if (!producto) {
    alert('❌ Producto no encontrado.');
    return;
  }

  const yaAgregado = productosAgregados.find(p => p.id_producto == idProducto);
  if (yaAgregado) {
    yaAgregado.cantidad += cantidad;
  } else {
    productosAgregados.push({
      id_producto: producto.id,
      nombre: producto.nombre,
      cantidad: cantidad,
      precio_unitario: producto.precio
    });
  }

  actualizarListaPedido();
});

// Mostrar lista de productos agregados
function actualizarListaPedido() {
  listaPedido.innerHTML = '';

  productosAgregados.forEach(p => {
    const li = document.createElement('li');

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.onclick = () => removerProducto(p.id_producto);

    li.textContent = `${p.nombre} - Cantidad: ${p.cantidad}`;
    li.appendChild(btnEliminar);
    
    listaPedido.appendChild(li);
  });
}

function removerProducto(idProducto) {
  productosAgregados = productosAgregados.filter(p => p.id_producto != idProducto);
  actualizarListaPedido();
}


// Enviar pedido
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (productosAgregados.length === 0) {
    alert('Debe agregar al menos un producto al pedido.');
    return;
  }

  const cliente = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    direccion: document.getElementById('direccion').value,
    telefono: document.getElementById('telefono').value
  };

  const datos = {
    cliente: cliente,
    productos: productosAgregados
  };

  try {
    const res = await fetch(`${BASIC_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const result = await res.json();

    if (res.ok) {
      alert(`✅ Pedido realizado con éxito. Código: ${result.id_pedido}`);
      form.reset();
      productosAgregados = [];
      actualizarListaPedido();
      selectProducto.disabled = true;
    } else {
      alert('❌ Error al realizar el pedido: ' + result.error);
    }
  } catch (error) {
    alert('❌ Error de red al enviar el pedido.');
    console.error(error);
  }
});