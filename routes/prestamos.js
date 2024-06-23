var express = require('express');
const prestamosC = require('../controllers/prestamos.c');
var router = express.Router();

/* GET Cuentas prestamos: */
router.get('/', function (req, res, next) {
    prestamosC.listar()
        .then((respuesta) => {
            res.status(200).json({
                status: "200",
                mensaje: respuesta.mensaje,
                cuentas_prestamos: respuesta.data
            })
        })
        .catch((error) => {
            res.status(400).json({
                status: "400",
                mensaje: error
            })
        })
});

/* GET Cuentas prestamos la fecha proxima de pago: */
router.get('/fecha-proxima/:cuenta', function (req, res, next) {
  prestamosC.fecha_pago(req.params.cuenta)
      .then((respuesta) => {
          res.status(200).json({
              status: "200",
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

/* POST Cuentas prestamos: */
router.post('/agregar', function(req, res, next) {
    prestamosC.agregar(req.body)
    .then((respuesta) => {
      res.status(201).json({
        status: "201",
        mensaje: respuesta.mensaje,
        cuenta_ahorro: respuesta.data
      })
    })
    .catch((error) => {
      res.status(400).json({
        status: "400",
        mensaje: error
      })
    })
});

/* DELETE Cuentas prestamos: */
router.delete('/eliminar/:cuenta', function(req, res, next) {
    prestamosC.eliminar(req.params.cuenta)
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
