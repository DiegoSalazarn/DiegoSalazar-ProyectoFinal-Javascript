// Constante de almacenamiento en LocalStorage
const STORAGE_KEY = "productosCarrito";

// Carrito de compras
let cart = [];
let stockProductos = [];
let productLimits = {};

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

// Función para cargar productos desde el archivo JSON
function loadProductsFromJSON() {
    fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            stockProductos = data.productos;
            productLimits = data.limites;
            renderProductCards();
            updateCart();
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
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

// Función para asignar eventos a los botones "Añadir al carrito"
function assignAddToCartEvents() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
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
                <button class="btn-increment" data-id="${item.product.id}">+</button>
                <button class="btn-decrement" data-id="${item.product.id}">-</button>
                <button onclick="removeFromCart('${item.product.id}')">Eliminar</button>
            </div>`;
        total += subtotal;
    });

    cartItems.innerHTML = cartHTML;
    document.getElementById('total-price-sidebar').innerText = `Total: ${total}$`;

    // Actualizar el contador de productos en el ícono del carrito
    cartCount.textContent = cart.length;
    saveCartToLocalStorage();

    // Añadir eventos para los botones de incrementar (+) y decrementar (-)
    document.querySelectorAll('.btn-increment').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            changeQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.btn-decrement').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            changeQuantity(productId, -1);
        });
    });
}

// Función para cambiar la cantidad de productos en el carrito
function changeQuantity(productId, amount) {
    console.log(`Cambiando cantidad del producto ${productId} por ${amount}`);
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        const newQuantity = cart[productIndex].quantity + amount;

        console.log(`Nueva cantidad: ${newQuantity}`);

        if (newQuantity > limit) {
            Swal.fire({
                icon: "warning",
                title: "Límite alcanzado",
                text: `No puedes añadir más de ${limit} unidades de este producto.`,
            });
        } else if (newQuantity <= 0) {
            console.log(`Eliminando producto ${productId} del carrito`);
            removeFromCart(productId);
        } else {
            cart[productIndex].quantity = newQuantity;
            updateCart();
        }
    } else {
        console.error(`Producto con id ${productId} no encontrado en el carrito`);
    }
}

// Función para añadir producto al carrito con límite de cantidad
function addToCart(productId) {
    const product = stockProductos.find(p => p.id === productId);
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        if (cart[productIndex].quantity < limit) {
            cart[productIndex].quantity += 1;

            // Mostrar alerta al añadir más cantidad del mismo producto
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Añadido ${product.descripcion} al carrito`,
                showConfirmButton: false,
                timer: 100
            });
        } else {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: `No se pueden añadir más de ${limit} unidades de este producto.`,
            });
        }
    } else {
        cart.push({ product, quantity: 1 });

        // Mostrar alerta al añadir un nuevo producto al carrito
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Añadido ${product.descripcion} al carrito`,
            showConfirmButton: false,
            timer: 1500
        });
    }
    updateCart();
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.product.id === productId);

    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        updateCart();
    } else {
        console.error(`Producto con id ${productId} no encontrado en el carrito`);
    }
}

// Función para mostrar el formulario de datos del usuario al finalizar la compra
function showUserDataForm() {
    Swal.fire({
        title: 'Datos del comprador',
        html: `
            <label for="nombre">Nombre y Apellido:</label>
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre y Apellido" required>

            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" class="swal2-input" placeholder="Correo Electrónico" required><br>

            <label for="direccion">Dirección:</label><br>
            <input type="text" id="direccion" class="swal2-input" placeholder="Dirección" required><br>

            <label for="provincia">Provincia:</label>
            <select id="provincia" class="swal2-select" required>
                <option value="" disabled selected>Selecciona una provincia</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                <option value="Catamarca">Catamarca</option>
                <option value="Chaco">Chaco</option>
                <option value="Chubut">Chubut</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Corrientes">Corrientes</option>
                <option value="Entre Ríos">Entre Ríos</option>
                <option value="Formosa">Formosa</option>
                <option value="Jujuy">Jujuy</option>
                <option value="La Pampa">La Pampa</option>
                <option value="La Rioja">La Rioja</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Misiones">Misiones</option>
                <option value="Neuquén">Neuquén</option>
                <option value="Río Negro">Río Negro</option>
                <option value="Salta">Salta</option>
                <option value="San Juan">San Juan</option>
                <option value="San Luis">San Luis</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Santiago del Estero">Santiago del Estero</option>
                <option value="Tierra del Fuego">Tierra del Fuego</option>
                <option value="Tucumán">Tucumán</option>
            </select>

            <label for="ciudad">Ciudad:</label><br>
            <input type="text" id="ciudad" class="swal2-input" placeholder="Ciudad" required>

            <label for="codigo-postal">Código Postal:</label>
            <input type="text" id="codigo-postal" class="swal2-input" placeholder="Código Postal" required>
        `,
        confirmButtonText: 'Confirmar Compra',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value;
            const email = Swal.getPopup().querySelector('#email').value;
            const direccion = Swal.getPopup().querySelector('#direccion').value;
            const provincia = Swal.getPopup().querySelector('#provincia').value;
            const ciudad = Swal.getPopup().querySelector('#ciudad').value;
            const codigoPostal = Swal.getPopup().querySelector('#codigo-postal').value;

            // Validar que todos los campos estén llenos
            if (!nombre || !email || !direccion || !provincia || !ciudad || !codigoPostal) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }
            return { nombre, email, direccion, provincia, ciudad, codigoPostal };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, email, direccion, provincia, ciudad, codigoPostal } = result.value;

            // Crear el resumen de la compra (productos y total)
            let totalCompra = 0;
            let resumenProductos = '';
            cart.forEach(item => {
                const subtotal = item.product.precio * item.quantity;
                resumenProductos += `- ${item.product.descripcion}: $${item.product.precio} x ${item.quantity} = $${subtotal}<br>`;
                totalCompra += subtotal;
            });

            // Mostrar confirmación final con resumen de la compra
            Swal.fire({
                title: '¿Estás seguro de realizar la compra?',
                html: `
                    <strong>Nombre:</strong> ${nombre}<br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Dirección:</strong> ${direccion}, ${ciudad}, ${provincia}, ${codigoPostal}<br><br>
                    <strong>Productos:</strong><br>
                    ${resumenProductos}<br>
                    <strong>Total a pagar:</strong> $${totalCompra}
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, confirmar compra',
                cancelButtonText: 'Cancelar'
            }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                    sendPurchaseToAPI(nombre, email, direccion, provincia, ciudad, codigoPostal);
                    // Mostrar mensaje de éxito y vaciar el carrito
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Compra finalizada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        cart = [];
                        updateCart();
                    });
                }
            });
        }
    });
}

// Función para enviar la compra a la API
function sendPurchaseToAPI(nombre, email, direccion, provincia, ciudad, codigoPostal) {
    const apiEndpoint = 'http://localhost:3000/api/compras';

    const purchaseData = {
        nombre: nombre,
        email: email,
        direccion: direccion,
        provincia: provincia,
        ciudad: ciudad,
        codigoPostal: codigoPostal,
        productos: cart.map(item => ({
            descripcion: item.product.descripcion,
            cantidad: item.quantity,
            precio: item.product.precio
        }))
    };

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Compra procesada correctamente:', data);
    })
    .catch(error => {
        console.error('Error al procesar la compra:', error);
    });
}

// Inyectar dinámicamente el sidebar del carrito
function renderCartSidebar() {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = `
        <div id="cart-sidebar" class="cart-sidebar">
            <div class="cart-sidebar-content">
                <span class="close-sidebar">&times;</span>
                <h2>Tu Carrito</h2>
                <div id="cart-items-sidebar"></div>
                <p id="total-price-sidebar">Total: 0$</p>
                <button id="finalizar-compra" class="btn btn-primary">Finalizar Compra</button>
            </div>
        </div>
    `;
    document.body.appendChild(sidebarContainer);

    document.querySelector('.close-sidebar').addEventListener('click', function() {
        closeCartSidebar();
    });

    document.getElementById('finalizar-compra').addEventListener('click', function() {
        if (cart.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El carrito está vacío.",
            });
        } else {
            showUserDataForm();
        }
    });
}

// Abrir y cerrar sidebar
function openCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = '0';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.right = '-300px';
}

// Llamar a la función para inyectar el sidebar del carrito
renderCartSidebar();

// Cargar el carrito desde LocalStorage y productos desde JSON
loadCartFromLocalStorage();
loadProductsFromJSON();

// Evento para abrir el sidebar cuando se haga clic en el ícono del carrito
document.querySelector('.navbar-cart a').addEventListener('click', function(event) {
    event.preventDefault();
    openCartSidebar();
});