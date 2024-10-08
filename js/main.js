// Constante de almacenamiento en LocalStorage
const STORAGE_KEY = "productosCarrito";

// Definición del stock de productos
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

// Limite por producto.

const productLimits = {
  "0": 3, // Límite para Remera negra
  "1": 5, // Límite para Remera blanca
  "2": 2, // Límite para Remera negra con rayos
  "3": 4, // Límite para Remera Negra Clasica
  "4": 3, // Límite para Remera negra con mariposa
  "5": 5, // Límite para Remera blanca thythm
  "6": 4, // Límite para Pantalón tipo jagger
  "7": 3, // Límite para Jagger Verde
  "8": 5, // Límite para Jean negro
  "9": 4, // Límite para Jean negro clásico
  "10": 2, // Límite para Jagger color beige
  "11": 5, // Límite para Jean clásico camuflado
  "12": 3, // Límite para Buzo nike bi-color
  "13": 4, // Límite para Buzo nike clásico
  "14": 3  // Límite para Buzo nike bi-color negro
};


let cart = [];

function addToCart(productId) {
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const product = stockProductos.find(p => p.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        if (cart[productIndex].quantity < limit) {
            cart[productIndex].quantity += 1;
        } else {
            alert(`No se pueden añadir más de ${limit} unidades de este producto.`);
        }
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    let total = 0;

    let cartHTML = "";
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
    document.getElementById("total-price").innerText = `Total: ${total}$`;
}

function changeQuantity(productId, amount) {
    const productIndex = cart.findIndex(item => item.product.id === productId);
    const limit = productLimits[productId];

    if (productIndex !== -1) {
        const newQuantity = cart[productIndex].quantity + amount;

        if (newQuantity > limit) {
            alert(`No se pueden tener más de ${limit} unidades de este producto.`);
        } else if (newQuantity <= 0) {
            cart.splice(productIndex, 1);
        } else {
            cart[productIndex].quantity = newQuantity;
        }
        updateCart();
    }
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.product.id === productId);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        updateCart();
    }
}

function displayProducts() {
    const buttons = document.querySelectorAll(".add-to-cart");
    
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            addToCart(productId);
        });
    });
}

document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.setAttribute("data-id", index.toString());
});

displayProducts();

/*BOTON DE FINALIZAR COMPRA*/

// Mostrar modal de datos del usuario
const modalDatos = document.getElementById("modal-datos");
const modalResumen = document.getElementById("modal-resumen");
const btnFinalizarCompra = document.getElementById("finalizar-compra");
const formDatos = document.getElementById("form-datos");
const resumenDetalles = document.getElementById("resumen-detalles");
const spanCloses = document.querySelectorAll(".close");

btnFinalizarCompra.addEventListener('click', function() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
    } else {
        modalDatos.style.display = "block";
    }
});

// Cerrar modales cuando se hace clic en la "X"
spanCloses.forEach(span => {
    span.addEventListener('click', function() {
        modalDatos.style.display = "none";
        modalResumen.style.display = "none";
    });
});

// Procesar el formulario y mostrar el resumen de compra
formDatos.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener datos del usuario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;

    // Generar el resumen de compra
    let resumen = `<strong>Nombre:</strong> ${nombre}<br>`;
    resumen += `<strong>Correo:</strong> ${email}<br>`;
    resumen += `<strong>Dirección:</strong> ${direccion}<br><br>`;
    resumen += "<strong>Productos:</strong><br>";

    let total = 0;
    cart.forEach(item => {
        resumen += `- ${item.product.descripcion}: $${item.product.precio} x ${item.quantity}<br>`;
        total += item.product.precio * item.quantity;
    });

    resumen += `<br><strong>Total a pagar:</strong> $${total}`;

    // Mostrar el resumen en el modal de resumen
    resumenDetalles.innerHTML = resumen;

    // Cerrar modal de datos y abrir modal de resumen
    modalDatos.style.display = "none";
    modalResumen.style.display = "block";
});

// Cerrar el modal de resumen al hacer clic en "Cerrar"
document.getElementById("cerrar-resumen").addEventListener('click', function() {
    modalResumen.style.display = "none";
});

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    if (event.target == modalDatos) {
        modalDatos.style.display = "none";
    }
    if (event.target == modalResumen) {
        modalResumen.style.display = "none";
    }
};

// Función para renderizar las cards de productos separadas por categorías
function renderProductCards() {
    const container = document.getElementById('products-container');
    let cardsHTML = '';

    // Categorías separadas
    const categorias = ['remeras', 'pantalones', 'buzos'];

    categorias.forEach(categoria => {
        // Agregar un título para cada categoría
        cardsHTML += `<div class="title-article color-title-black">
                        <h2>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
                      </div>`;
        cardsHTML += '<div class="row">'; // Abrir un row para cada categoría

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

function assignAddToCartEvents() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

renderProductCards();

