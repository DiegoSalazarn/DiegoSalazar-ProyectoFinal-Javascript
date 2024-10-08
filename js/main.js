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

// Carrito de compras
let cart = [];

// Función para guardar carrito en LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Función para cargar carrito desde LocalStorage
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

    // Inyectar el HTML generado en el contenedor
    container.innerHTML = cardsHTML;
    assignAddToCartEvents();
}

// Función para actualizar el carrito en pantalla
function updateCart() {
    const cartItems = document.getElementById('cart-items');
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
    document.getElementById('total-price').innerText = `Total: ${total}$`;

    saveCartToLocalStorage();
}

// Función para añadir producto al carrito
function addToCart(productId) {
    const product = stockProductos.find(p => p.id === productId);
    const productIndex = cart.findIndex(item => item.product.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCart();
}

// Cambiar la cantidad del producto en el carrito
function changeQuantity(productId, amount) {
    const productIndex = cart.findIndex(item => item.product.id === productId);

    if (productIndex !== -1) {
        const newQuantity = cart[productIndex].quantity + amount;

        if (newQuantity > 0) {
            cart[productIndex].quantity = newQuantity;
        } else {
            cart.splice(productIndex, 1);
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

// Función para inyectar el modal en el DOM
function renderUserModal() {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <!-- Modal para ingresar datos del usuario -->
        <div id="modal-datos" class="modal" style="display: none;">
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
    setupModalEvents();
}

// Función para configurar los eventos del modal
function setupModalEvents() {
    const modalDatos = document.getElementById('modal-datos');
    const spanClose = modalDatos.querySelector('.close');
    const formDatos = document.getElementById('form-datos');

    spanClose.addEventListener('click', () => {
        modalDatos.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target == modalDatos) {
            modalDatos.style.display = 'none';
        }
    };

    // Evento para enviar el formulario y procesar los datos del usuario
    formDatos.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;

        console.log(`Nombre: ${nombre}, Email: ${email}, Dirección: ${direccion}`);

        // Aquí podrías guardar los datos del usuario o realizar alguna acción

        // Cerrar el modal al enviar los datos
        modalDatos.style.display = 'none';
    });
}

// Evento para abrir el modal cuando se haga clic en "Finalizar Compra"
document.getElementById('finalizar-compra').addEventListener('click', function() {
    const modalDatos = document.getElementById('modal-datos');
    if (cart.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El carrito está vacío.",
        });
    } else {
        modalDatos.style.display = 'block';
    }
});

// Función para inyectar el modal de resumen de compras en el DOM
function renderResumenModal() {
    const modalContainer = document.createElement('div'); // Crear un contenedor para el modal
    modalContainer.innerHTML = `
        <!-- Modal para mostrar el resumen de compra -->
        <div id="modal-resumen" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Resumen de la Compra</h2>
                <p id="resumen-detalles"></p>
                <button id="cerrar-resumen" class="btn btn-secondary">Comprar</button>
            </div>
        </div>
    `;
    
    // Inyectar el modal en el body
    document.body.appendChild(modalContainer);

    // Asignar la lógica para abrir y cerrar el modal
    setupResumenModalEvents();
}

// Función para configurar los eventos del modal de resumen
function setupResumenModalEvents() {
    const modalResumen = document.getElementById('modal-resumen');
    const spanClose = modalResumen.querySelector('.close');
    const btnCerrarResumen = document.getElementById('cerrar-resumen');

    // Evento para cerrar el modal al hacer clic en la "X"
    spanClose.addEventListener('click', () => {
        modalResumen.style.display = 'none';
    });

    // Evento para cerrar el modal al hacer clic en el botón "Cerrar"
    btnCerrarResumen.addEventListener('click', () => {
        modalResumen.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera del contenido
    window.onclick = function(event) {
        if (event.target == modalResumen) {
            modalResumen.style.display = 'none';
        }
    };
}

// Función para mostrar el resumen del carrito en el modal
function showCartSummary() {
    const modalResumen = document.getElementById('modal-resumen');
    const resumenDetalles = document.getElementById('resumen-detalles');
    
    // Generar el contenido del resumen
    let resumenHTML = "";
    let total = 0;

    if (cart.length === 0) {
        resumenHTML = "<p>El carrito está vacío.</p>";
    } else {
        resumenHTML += "<strong>Productos:</strong><br>";
        cart.forEach(item => {
            resumenHTML += `- ${item.product.descripcion}: $${item.product.precio} x ${item.quantity}<br>`;
            total += item.product.precio * item.quantity;
        });
        resumenHTML += `<br><strong>Total a pagar:</strong> $${total}`;
    }
    resumenDetalles.innerHTML = resumenHTML;
    modalResumen.style.display = 'block';
}

// Evento para abrir el modal de resumen cuando se finalice la compra
document.getElementById('finalizar-compra').addEventListener('click', function() {
    if (cart.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El carrito está vacío.",
        });
    } else {
        showCartSummary();
    }
});
renderResumenModal();


renderUserModal();

loadCartFromLocalStorage();

renderProductCards();

updateCart();

