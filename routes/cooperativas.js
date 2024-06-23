var express = require('express');
const cooperativasC = require('../controllers/cooperativas.c');
var router = express.Router();

/* GET Grupos de Cooperativas: */
router.get('/', function(req, res, next) {
  cooperativasC.listar()
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      grupos_cooperativas: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* GET Grupos de Cooperativas proxima fecha de pago: */
router.get('/fecha-proxima/:cuenta', function(req, res, next) {
  cooperativasC.fecha_proxima(req.params.cuenta)
  .then((respuesta) => {
    res.status(200).json({
      status: "200",
      mensaje: respuesta.mensaje,
      cooperativa: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* POST Grupos de Cooperativas : */
router.post('/agregar', function(req, res, next) {
    cooperativasC.agregar(req.body)
    .then((respuesta) => {
      res.status(201).json({
        status: "201",
        mensaje: respuesta.mensaje,
        grupo_cooperativa: respuesta.data
      })
    })
    .catch((error) => {
      res.status(400).json({
        status: "400",
        mensaje: error
      })
    })
});

// Agregar Relacion de Usuario con Grupo de Cooperativa
router.post('/:usuario/:cooperativa', function(req, res, next) {
    cooperativasC.relacion_usuario(req.params.usuario, req.params.cooperativa)
    .then((respuesta) => {
      res.status(201).json({
        status: "201",
        mensaje: respuesta.mensaje,
        relacion_cooperativa: respuesta.data
      })
    })
    .catch((error) => {
      res.status(400).json({
        status: "400",
        mensaje: error
      })
    })
});

/* DELETE Relacion de Usuarios con Cooperativas: */
router.delete('/eliminar-relacion/:usuario/:cuenta', function(req, res, next) {
  cooperativasC.eliminar_relacion(req.params.usuario, req.params.cuenta)
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

/* PUT Grupos Cooperativas: */
router.put('/editar/:cuenta', function(req, res, next) {
  cooperativasC.editar(req.body, req.params.cuenta)
  .then((respuesta) => {
    res.status(201).json({
      status: "201",
      mensaje: respuesta.mensaje,
      cooperativa_editada: respuesta.data
    })
  })
  .catch((error) => {
    res.status(400).json({
      status: "400",
      mensaje: error
    })
  })
});

/* DELETE Grupo de Cooperativa: */
router.delete('/eliminar/:cuenta', function(req, res, next) {
  cooperativasC.eliminar(req.params.cuenta)
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
