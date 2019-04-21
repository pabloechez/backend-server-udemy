var express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

var app = express();
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

app.use(fileUpload());



// =====================================================
// Subir archivos
// =====================================================
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipo de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0 ){
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valido',
            error: { message: 'Tipo de colección no valido'}
        });
    }

    if(!req.files){
        res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            error: { message: 'Debe seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length -1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf( extensionArchivo) < 0){
        res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            error: { message: 'Las extensiones válidas son '+extensionesValidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path;
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err =>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover arhivo',
                error: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res);
    });

});

function subirPorTipo( tipo, id, nombreArchivo, res) {
    if( tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if(!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'}
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                //fs.unlink(pathViejo);
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if( tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if(!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    medico: medicoActualizado
                });
            });
        });

    }

    if( tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if(!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe'}
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    hospital: hospitalActualizado
                });
            });
        });

    }

}



module.exports = app;