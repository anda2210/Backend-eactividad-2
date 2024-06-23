const UsuaiosModel = require('../models/usuarios.m');
const PrestamosModel = require('../models/prestamos.m');
const { fecha, fecha_hoy } = require('../functions/fechas');

class prestamosControllers {
    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                if (prestamos.length === 0) {
                    return reject('No hay cuentas de prestamos registradas en el Banco')
                }
                const data = []
                prestamos.forEach(prestamo => {
                    data.push({
                        balance: prestamo.balance + "Bs",
                        intereses: prestamo.intereses + "%",
                        estado: prestamo.estado,
                        fecha_pago: prestamo.fecha_pago,
                        monto_pago: prestamo.monto_pago + "Bs",
                        dueño: prestamo.dueño,
                        numero_cuenta: prestamo._id
                    })
                });
                return resolve({
                    data: data,
                    mensaje: "Listado con éxito las cuentas de prestamos"
                })
            } catch (error) {
                return reject(error);
            }
        });
    };

    fecha_pago(cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                for (let i = 0; i < prestamos.length; i++) {
                    if (prestamos[i]._id == cuenta) {
                        if (prestamos[i].estado === "solvente") {
                            return resolve({
                                mensaje: "La cuenta es libre de deuda",
                                data: {
                                    balance: prestamos[i]
                                }
                            })
                        }
                        if (fecha_hoy() <= prestamos[i].fecha_pago) {
                            return resolve({
                                mensaje: "La cuenta posee una deuda en la siguiente fecha proxima",
                                data: {
                                    fecha_proxima: prestamos[i].fecha_pago,
                                    numero_cuenta: prestamos[i].numero_cuenta,
                                    dueño: prestamos[i].dueño
                                }
                            })
                        }
                        return resolve({
                            mensaje: "La cuenta tiene una deuda atrasada desde la siguiente fecha",
                            data: {
                                fecha_proxima: prestamos[i].fecha_pago,
                                numero_cuenta: prestamos[i].numero_cuenta,
                                dueño: prestamos[i].dueño
                            }
                        })
                    }
                }
                return reject("No existe la cuenta que desea ver su fecha de pago")
            } catch (error) {
                return reject(error);
            }
        });
    }

    agregar(prestamo) {
        return new Promise(async (resolve, reject) => {
            try {
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                if (!prestamo.dueño || !prestamo.prestamo || !prestamo.intereses) {
                    return reject("Faltan propiedades escenciales para agregar la cuenta")
                }
                for (let a = 0; a < prestamos.length; a++) {
                    if (prestamos[a].dueño === prestamo.dueño) {
                        return reject("Ya este usuario posee una cuenta de Prestamos")
                    }
                }
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === prestamo.dueño) {
                        let fecha_pago = fecha()
                        console.log(fecha_pago)
                        let tasa_diaria = (0.10 / 360) * Number(prestamo.prestamo)
                        let tasa_mensual = tasa_diaria * 30
                        let nuevo = {
                            balance: Number(prestamo.prestamo),
                            intereses: Number(prestamo.intereses),
                            estado: "deuda",
                            fecha_pago: fecha_pago,
                            monto_pago: (Number(prestamo.prestamo) + tasa_mensual).toFixed(2),
                            dueño: prestamo.dueño
                        }
                        const cuenta_nueva = await PrestamosModel.create(nuevo)
                        if (!cuenta_nueva) {
                            return reject('Hubo un error al crear la nueva cuenta de prestamos')
                        }
                        return resolve({
                            mensaje: "Se ha registrado con exito la cuenta de prestamos del usuario " + prestamo.dueño,
                            data: {
                                balance: cuenta_nueva.balance + "Bs",
                                intereses: cuenta_nueva.intereses + "%",
                                estado: cuenta_nueva.estado,
                                fecha_pago: cuenta_nueva.fecha_pago,
                                monto_pago: cuenta_nueva.monto_pago + "Bs",
                                dueño: cuenta_nueva.dueño,
                                numero_cuenta: cuenta_nueva.numero_cuenta
                            }
                        })
                    }
                }
                return reject("No existe el usuario que será dueño de la cuenta")
            } catch (error) {
                return reject(error);
            }
        });
    }

    eliminar(cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                for (let i = 0; i < prestamos.length; i++) {
                    if (prestamos[i]._id == cuenta) {
                        const cuentaEliminada = await PrestamosModel.findByIdAndDelete(cuenta)
                        if (!cuentaEliminada) {
                            return reject('Hubo un error al eliminar la cuenta')
                        }
                        return resolve({
                            mensaje: "Se ha eliminado con exito la cuenta de prestamos " + cuenta
                        })
                    }
                }
                return reject("No existe la cuenta de prestamo que desea eliminar")
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = new prestamosControllers();