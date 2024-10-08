// Constante de almacenamiento en LocalStorage
const STORAGE_KEY = "productosCarrito";

// Stock de productos
const stockProductos = [
  { id: "0", descripcion: "Remera negra con diseño urbano", precio: 12000, categoria: "remeras", img: "../assets/remera-oversize.jpg" },
  { id: "1", descripcion: "Remera blanca con diseño de flamas", precio: 12000, categoria: "remeras", img: "../assets/remera-oversize-blanca.jpg" },
  { id: "2", descripcion: "Remera negra con diseño de rayos", precio: 13000, categoria: "remeras", img: "../assets/remera-oversize-rayos.jpg" },
  { id: "3", descripcion: "Remera Negra Clasica", precio: 10000, categoria: "remeras", img: "../assets/remera-clasica-negra.jpg" },
  { id: "4", descripcion: "Remera negra con diseño mariposa rosita", precio: 13000, categoria: "remeras", img: "../assets/remera-negra-estampada-mariposa.jpg" },
  { id: "5", descripcion: "Remera blanca thythm estampado school", precio: 17000, categoria: "remeras", img: "../assets/remera-blanca-trythm.jpg" },
  { id: "6", descripcion: "Pantalon tipo jagger negro", precio: 30000, categoria: "pantalones", img: "../assets/pantalon1.jpg" },
  { id: "7", descripcion: "Jagger Verde oscuro con elastico", precio: 28000, categoria: "pantalones", img: "../assets/pantalon2.jpg" },
  { id: "8", descripcion: "Jean negro, varios bolsillos", precio: 24999, categoria: "pantalones", img: "../assets/pantalon3.jpg" },
  { id: "9", descripcion: "Jean negro clasico", precio: 26000, categoria: "pantalones", img: "../assets/pantalon4.jpg" },
  { id: "10", descripcion: "Jagger color beige", precio: 28000, categoria: "pantalones", img: "../assets/pantalon5.jpg" },
  { id: "11", descripcion: "Jean clasico / Camuflado militar", precio: 24999, categoria: "pantalones", img: "../assets/pantalon6.jpg" },
  { id: "12", descripcion: "Buzo nike Bi-Color / Negro con beige", precio: 50000, categoria: "buzos", img: "../assets/buzo-nike.jpg" },
  { id: "13", descripcion: "Buzo nike Clasico Bi-Color", precio: 45000, categoria: "buzos", img: "../assets/buzo-nike2.jpg" },
  { id: "14", descripcion: "Buzo nike Bi-Color / negro con blanco", precio: 50000, categoria: "buzos", img: "../assets/buzo-nike3.jpg" }
];

// Límites de compra por producto
const productLimits = {
  "0": 3,  
  "1": 1,  
  "2": 2,  
  "3": 3, 
  "4": 1,  
  "5": 5,  
  "6": 4,
  "7": 2,
  "8": 4,
  "9": 2,
  "10": 2,
  "11": 4,
  "12": 1,
  "13": 3,
  "14": 6
};

// Carrito de compras
let cart = [];

// Función para guardar carrito en LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem(STORAGE_KEY);
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Función para renderizar las cards de productos separadas por categorías
function renderProductCards() {
    const container = document.getElementById('products-container');
    let cardsHTML = '';

    const categorias = ['remeras', 'pantalones', 'buzos'];

    categorias.forEach(categoria => {
        cardsHTML += `<div class="title-article color-title-black">
                        <h2>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
                      </div>`;
        cardsHTML += '<div class="row">';

        stockProductos
          .filter(product => product.categoria === categoria)
          .forEach(product => {
            cardsHTML += `
            <div class="col-md-4 mb-4">
                <div class="card-articulos">
                    <div class="card">
                        <img src="${product.img}" title="${product.descripcion}" class="card-img-top" alt="${product.descripcion}">
                        <div class="card-body">
                            <p class="card-title Dfz-xl">${product.precio.toLocaleString()}$</p>
                            <p class="card-text">${product.descripcion}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>`;
          });

        cardsHTML += '</div>';
    });

    container.innerHTML = cardsHTML;
    assignAddToCartEvents();
}

// Función para actualizar el carrito en pantalla y el contador del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items-sidebar');
    const cartCount = document.getElementById('cart-count');
    let total = 0;
    let cartHTML = '';

    cart.forEach(item => {
        const subtotal = item.product.precio * item.quantity;
        cartHTML += `
            <div>
                <span>${item.product.descripcion} - ${item.product.precio}$ x ${item.quantity} = ${subtotal}$</span>
                <button onclick="changeQuantity('${item.product.id}', 1)">+</button>
                <button onclick="changeQuantity('${item.product.id}', -1)">-</button>
                <button onclick="removeFromCart('${item.product.id}')">Eliminar</button>
            </div>`;
        total += subtotal;
    });

    cartItems.innerHTML = cartHTML;
    document.getElementById('total-price-sidebar').innerText = `Total: ${total}$`;

    // Actualizar el contador de productos en el ícono del carrito
    cartCount.textContent = cart.length;
    saveCartToLocalStorage();
}

// Función para añadir producto al carrito con límite de cantidad
function addToCart(productId) {
    const product = stockProductos.find(p => p.id === productId);
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        if (cart[productIndex].quantity < limit) {
            cart[productIndex].quantity += 1;
        } else {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: `No se pueden añadir más de ${limit} unidades de este producto.`,
            });
        }
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCart();
}

// Cambiar la cantidad del producto en el carrito respetando el límite
function changeQuantity(productId, amount) {
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        const newQuantity = cart[productIndex].quantity + amount;

        if (newQuantity > limit) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: `No se pueden añadir más de ${limit} unidades de este producto.`,
            });
        } else if (newQuantity <= 0) {
            cart.splice(productIndex, 1);
        } else {
            cart[productIndex].quantity = newQuantity;
        }
        updateCart();
    }
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.product.id === productId);

    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        updateCart();
    }
}

// Asignar eventos a los botones "Añadir al carrito"
function assignAddToCartEvents() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Inyección dinámica del sidebar
function renderCartSidebar() {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = `
        <div id="cart-sidebar" class="cart-sidebar" style="position: fixed; top: 0; right: -300px; width: 300px; height: 100%; background-color: #f8f9fa; box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5); overflow-y: auto; transition: right 0.4s ease; z-index: 1000;">
            <div class="cart-sidebar-content" style="padding: 20px;">
                <span class="close-sidebar" style="font-size: 28px; font-weight: bold; color: #333; cursor: pointer;">&times;</span>
                <h2>Tu Carrito</h2>
                <div id="cart-items-sidebar"></div>
                <p id="total-price-sidebar">Total: 0$</p>
                <button id="finalizar-compra" class="btn btn-primary mt-3">Finalizar Compra</button>
            </div>
        </div>
    `;
    document.body.appendChild(sidebarContainer);

    // Lógica para cerrar el sidebar
    document.querySelector('.close-sidebar').addEventListener('click', function() {
        closeCartSidebar();
    });

    // Evento del botón "Finalizar Compra" para abrir el modal de datos del usuario
    document.getElementById('finalizar-compra').addEventListener('click', function() {
        const modalDatos = document.getElementById('modal-datos');
        if (cart.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El carrito está vacío.",
            });
        } else {
            modalDatos.style.display = 'block'; // Mostrar el modal de datos
        }
    });
}

// Función para abrir el sidebar del carrito
function openCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = '0'; // Mostrar el sidebar
}

// Función para cerrar el sidebar del carrito
function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = '-300px'; // Ocultar el sidebar
}

// Evento para abrir el sidebar cuando se haga clic en el ícono del carrito
document.querySelector('.navbar-cart a').addEventListener('click', function(event) {
    event.preventDefault();
    openCartSidebar(); // Abrir el sidebar del carrito
});

// Inyectar el sidebar al cargar la página
renderCartSidebar();

// Función para inyectar el modal de datos del usuario
function renderUserModal() {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <!-- Modal para ingresar datos del usuario -->
        <div id="modal-datos" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Datos del Usuario</h2>
                <form id="form-datos">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                    
                    <label for="email">Correo electrónico:</label>
                    <input type="email" id="email" name="email" required>
                    
                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" required>
                    
                    <button type="submit" class="btn btn-primary mt-3">Enviar Datos</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);

    // Configuración de eventos del modal
    const modalDatos = document.getElementById('modal-datos');
    const spanClose = modalDatos.querySelector('.close');
    spanClose.addEventListener('click', () => modalDatos.style.display = 'none');
    
    window.onclick = function(event) {
        if (event.target == modalDatos) {
            modalDatos.style.display = 'none';
        }
    };
}

// Inyectar el modal de usuario al cargar la página
renderUserModal();

// Cargar el carrito desde LocalStorage y renderizar los productos
loadCartFromLocalStorage();
renderProductCards();
updateCart();


