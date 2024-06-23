var express = require('express');
const usuariosC = require('../controllers/usuarios.c');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  usuariosC.listar()
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      usuarios: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET Resumen del capital del banco. */
router.get('/resumen', function(req, res, next) {
  usuariosC.resumen()
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      usuarios: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET Cuentas deun usuario especifico */
router.get('/cuentas/:usuario', function(req, res, next) {
  usuariosC.cuentas(req.params.usuario)
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      usuarios: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* POST usuarios: */
router.post('/agregar', function(req, res, next) {
  usuariosC.agregar(req.body)
  .then((respuesta) => {
    res.status(201).json({
      status: "201",
      mensaje: respuesta.mensaje,
      usuario: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* PUT usuarios: */
router.put('/editar/:usuario', function(req, res, next) {
  usuariosC.editar(req.params.usuario, req.body)
  .then((respuesta) => {
    res.status(201).json({
      status: "201",
      mensaje: respuesta.mensaje,
      usuario: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* DELETE Usuarios: */
router.delete('/eliminar/:usuario', function(req, res, next) {
  usuariosC.eliminar(req.params.usuario)
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

module.exports = router;
