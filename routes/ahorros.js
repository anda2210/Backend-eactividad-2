var express = require('express');
const ahorrosC = require('../controllers/ahorros.c');
var router = express.Router();

/* GET Cuentas ahorros: */
router.get('/', function(req, res, next) {
  ahorrosC.listar()
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      cuentas_ahorro: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* POST Cuentas ahorros: */
router.post('/agregar', function(req, res, next) {
    ahorrosC.agregar(req.body)
    .then((respuesta) => {
      res.status(201).json({
        status: "201",
        mensaje: respuesta.mensaje,
        cuenta_prestamo: respuesta.data
      })
    })
    .catch((error) => {
      res.status(400).json({
        status: "400",
        mensaje: error
      })
    })
});

/* PUT Cuentas ahorros: */
router.put('/editar/:cuenta', function(req, res, next) {
  ahorrosC.editar(req.body, req.params.cuenta)
  .then((respuesta) => {
    res.status(201).json({
      status: "201",
      mensaje: respuesta.mensaje,
      cuenta_prestamo: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* DELETE Cuentas ahorros: */
router.delete('/eliminar/:cuenta', function(req, res, next) {
  ahorrosC.eliminar(req.params.cuenta)
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
