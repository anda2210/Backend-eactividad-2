var express = require('express');
const usuariosC = require('../controllers/usuarios.c');
const ahorrosC = require('../controllers/ahorros.c');
const prestamosC = require('../controllers/prestamos.c');
var router = express.Router();

/* GET home page. */
router.get('/resumen', function(req, res, next) {
  usuariosC.resumen()
  .then((respuesta) => {
    res.render('resumen', {data: respuesta.data})
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET Cuentas de un usuario especifico */
router.get('/cuentas/:usuario', function(req, res, next) {
  usuariosC.cuentas(req.params.usuario)
  .then((respuesta) => {
    res.render('cuentas_usuario', {data: respuesta.data, mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET users listing. */
router.get('/usuarios', function(req, res, next) {
  usuariosC.listar()
  .then((respuesta) => {
    res.render('usuarios', {usuarios: respuesta.data, mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home')
});

/* GET Cuentas ahorros: */
router.get('/ahorros-listar', function(req, res, next) {
  ahorrosC.listar()
  .then((respuesta) => {
    res.render('ahorros', {cuentas: respuesta.data})
  })
  .catch((error) => {
    res.render('ahorros', {mensaje: error, cuentas: null})
  })
});

/* POST Cuentas ahorros: */
router.post('/ahorros-agregar', function(req, res, next) {
  ahorrosC.agregar(req.body)
  .then((respuesta) => {
    res.render('ok', {mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.render('error', {mensaje: error})
  })
});

/* DELETE Cuentas ahorros: */
router.get('/ahorros-eliminar/:cuenta', function(req, res, next) {
  ahorrosC.eliminar(req.params.cuenta)
  .then((respuesta) => {
    res.render('ok', {mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.render('error', {mensaje: error})
  })
});

/* PUT Cuentas ahorros: */
router.post('/ahorros-editar/:cuenta', function(req, res, next) {
  ahorrosC.editar(req.body, req.params.cuenta)
  .then((respuesta) => {
    res.render('ok', {mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.render('error', {mensaje: error})
  })
});

/* GET Cuentas prestamos: */
router.get('/prestamos-listar', function (req, res, next) {
  prestamosC.listar()
  .then((respuesta) => {
    res.render('prestamos', {cuentas: respuesta.data})
  })
  .catch((error) => {
    res.render('prestamos', {mensaje: error, cuentas: null})
  })
});

/* DELETE Cuentas prestamos: */
router.get('/prestamos-eliminar/:cuenta', function(req, res, next) {
  prestamosC.eliminar(req.params.cuenta)
  .then((respuesta) => {
    res.render('ok', {mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.render('error', {mensaje: error})
  })
});

/* POST Cuentas prestamos: */
router.post('/prestamos-agregar', function(req, res, next) {
  prestamosC.agregar(req.body)
  .then((respuesta) => {
    res.render('ok', {mensaje: respuesta.mensaje})
  })
  .catch((error) => {
    res.render('error', {mensaje: error})
  })
});

module.exports = router;
