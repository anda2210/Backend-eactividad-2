var express = require('express');
const usuariosC = require('../controllers/usuarios.c');
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

module.exports = router;
