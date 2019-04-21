// Requires
let express = require('express');
let mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables
let app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var busquedaRoutes = require('./routes/busqueda');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagenes');
var loginRoutes = require('./routes/login');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
app.use('/busqueda', busquedaRoutes);

// Escuchar peticiones
app.listen(3000, ()=> {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});