// Requires
let express = require('express');
let mongoose = require('mongoose');

// Inicializar variables
let app = express();

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realiza correctamente'
    })
});

// Escuchar peticiones
app.listen(3000, ()=> {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});