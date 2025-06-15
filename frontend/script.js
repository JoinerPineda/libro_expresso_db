// Toggle menú principal
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}

// Toggle opciones del menú (sección carta)
function toggleOpcionesMenu() {
  const opciones = document.getElementById('opciones-menu');
  opciones.style.display = opciones.style.display === 'block' ? 'none' : 'block';
}

// Carrusel de productos
let indiceActual = 0;
const items = document.querySelectorAll('.carrusel-item');

function mostrarImagen(indice) {
  if (indice >= items.length) {
    indiceActual = 0;
  } else if (indice < 0) {
    indiceActual = items.length - 1;
  } else {
    indiceActual = indice;
  }

  items.forEach((item, i) => {
    item.classList.toggle('activo', i === indiceActual);
  });
}

function moverCarrusel(direccion) {
  mostrarImagen(indiceActual + direccion);
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarImagen(indiceActual);
});

// Mostrar un solo submenú a la vez
function mostrarSubmenu(categoria) {
  const submenus = document.querySelectorAll('.submenu');
  submenus.forEach(menu => {
    if (menu.id === 'submenu-' + categoria) {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    } else {
      menu.style.display = 'none';
    }
  });
}

// Toggle visibilidad de la sección domicilios usando clases CSS
function toggleDomicilios() {
  const seccion = document.getElementById('domicilios');
  seccion.classList.toggle('domicilios-visible');
  seccion.classList.toggle('domicilios-oculto');
}

const productosPorCategoria = {
  cafe: ['Espresso', 'Café Americano', 'Cappuccino', 'Latte', 'Mocha'],
  pasteleria: ['Croissant', 'Muffin de arándanos', 'Brownie', 'Tarta de limón'],
  tes: ['Té verde', 'Té negro', 'Infusión de manzanilla', 'Té chai'],
  bebidas: ['Limonada', 'Jugo de naranja', 'Agua mineral', 'Batido de fresa']
};

const categoriaSelect = document.getElementById('categoria');
const productoSelect = document.getElementById('producto');
const agregarBtn = document.getElementById('agregar-producto');
const listaPedido = document.getElementById('lista-pedido');

categoriaSelect.addEventListener('change', () => {
  const categoria = categoriaSelect.value;
  productoSelect.innerHTML = ''; // limpiar productos previos

  if (!categoria) {
    productoSelect.disabled = true;
    productoSelect.innerHTML = '<option value="" disabled selected>-- Escoge primero categoría --</option>';
    return;
  }

  productoSelect.disabled = false;

  const opciones = productosPorCategoria[categoria] || [];
  opciones.forEach(prod => {
    const option = document.createElement('option');
    option.value = prod.toLowerCase().replace(/\s+/g, '-');
    option.textContent = prod;
    productoSelect.appendChild(option);
  });
});

agregarBtn.addEventListener('click', () => {
  const productoSeleccionado = productoSelect.options[productoSelect.selectedIndex];
  if (!productoSeleccionado || productoSelect.disabled) {
    alert('Por favor selecciona un producto válido.');
    return;
  }

  // Crear item en la lista
  const li = document.createElement('li');
  li.textContent = productoSeleccionado.textContent;

  // Botón para eliminar producto añadido
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
