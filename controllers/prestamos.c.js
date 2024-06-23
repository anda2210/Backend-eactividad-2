const { v4: uuidv4 } = require('uuid');
const { prestamos, usuarios } = require('../database/database');
const { fecha, fecha_hoy } = require('../functions/fechas');

class prestamosControllers {
    listar() {
        return new Promise((resolve, reject) => {
            try {
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
                        numero_cuenta: prestamo.numero_cuenta
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
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < prestamos.length; i++) {
                    if (prestamos[i].numero_cuenta === cuenta) {
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
                                mensaje: "La cuenta posee una deuda en la siguiente fecha proxima" ,
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
        return new Promise((resolve, reject) => {
            try {
                if (!prestamo.dueño || !prestamo.prestamo) {
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
                        let tasa_diaria = (0.10 / 360) * prestamo.prestamo
                        let tasa_mensual = tasa_diaria * 30
                        let cuenta_nueva = {
                            balance: prestamo.prestamo,
                            intereses: 10,
                            estado: "deuda",
                            fecha_pago: fecha_pago,
                            monto_pago: (prestamo.prestamo + tasa_mensual).toFixed(2),
                            dueño: prestamo.dueño,
                            numero_cuenta: uuidv4()
                        }
                        prestamos.push(cuenta_nueva);
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
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < prestamos.length; i++) {
                    if (prestamos[i].numero_cuenta === cuenta) {
                        prestamos.splice(i, 1);
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