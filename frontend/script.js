const BASIC_URL = 'http://localhost:3000/api';

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}

function toggleOpcionesMenu() {
  const opciones = document.getElementById('opciones-menu');
  opciones.style.display = opciones.style.display === 'block' ? 'none' : 'block';
}

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

document.addEventListener('DOMContentLoaded', async () => {
  mostrarImagen(indiceActual);
  await cargarCategorias();
});

function toggleDomicilios() {
  const seccion = document.getElementById('domicilios');
  seccion.classList.toggle('domicilios-visible');
  seccion.classList.toggle('domicilios-oculto');
}

async function cargarCategorias() {
  try {
    const res = await fetch(BASIC_URL + '/categorias');
    const categorias = await res.json();

    const selectCategoria = document.getElementById('categoria');
    const contenedorMenu = document.getElementById('opciones-menu');

    categorias.forEach(cat => {
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

agregarBtn.addEventListener('click', () => {
  const productoSeleccionado = selectProducto.options[selectProducto.selectedIndex];
  if (!productoSeleccionado || selectProducto.disabled) {
    alert('Por favor selecciona un producto válido.');
    return;
  }

  const li = document.createElement('li');
  li.textContent = productoSeleccionado.textContent;

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.style.marginLeft = '10px';
  btnEliminar.style.backgroundColor = '#c66';
  btnEliminar.style.border = 'none';
  btnEliminar.style.color = 'white';
  btnEliminar.style.borderRadius = '6px';
  btnEliminar.style.cursor = 'pointer';
  btnEliminar.onclick = () => li.remove();

  li.appendChild(btnEliminar);
  listaPedido.appendChild(li);
});
