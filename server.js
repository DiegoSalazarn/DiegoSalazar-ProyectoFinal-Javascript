const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurar CORS para permitir solicitudes de cualquier origen y con los métodos correctos
const corsOptions = {
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));  // Aplicar la configuración de CORS

// Middleware para manejar JSON en el body de las solicitudes
app.use(express.json());

// Ruta para procesar la compra
app.post('/api/compras', (req, res) => {
    const { nombre, email, direccion, provincia, ciudad, codigoPostal, productos } = req.body;

    // Aquí podrías guardar los datos en una base de datos o procesarlos
    console.log('Datos de la compra recibidos:', req.body);

    // Respuesta al cliente
    res.status(201).json({
        message: 'Compra procesada correctamente',
        compra: {
            nombre,
            email,
            direccion,
            provincia,
            ciudad,
            codigoPostal,
            productos
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
