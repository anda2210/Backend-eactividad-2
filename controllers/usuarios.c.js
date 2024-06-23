const { tasa_interes_diaria } = require("../functions/tasas");
const UsuaiosModel = require('../models/usuarios.m');
const AhorrosModel = require('../models/ahorros.m');
const CooperativasModel = require('../models/cooperativas.m');
const RelacionCooperativasModel = require('../models/relaciones.m');
const PrestamosModel = require('../models/prestamos.m');

class usuariosControllers {
    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula'
                )
                if (usuarios.length === 0) {
                    return reject('No hay usuarios registrados en el Banco')
                }
                const data = []
                usuarios.forEach(usuario => {
                    data.push({
                        _id: usuario._id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        cedula: usuario.cedula,
                        correo: usuario.correo,
                        usuario: usuario.usuario
                    })
                });
                return resolve({
                    data: data,
                    mensaje: "Listado con éxito los Usuarios"
                })
            } catch (error) {
                return reject(error);
            }
        });
    };

    cuentas(usuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                const cooperativas_usuarios = await RelacionCooperativasModel.find().select(
                    '_id usuario cooperativa fechas_cuotas balance'
                )
                let falta = true
                let consultado = {}
                let cuen_aho = {}
                let cuen_pre = {}
                let cuen_cop = []
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === usuario) {
                        falta = false
                        consultado = usuarios[i]
                    }
                }
                if (falta) { return reject("No existe el usuario que deseas ver sus cuentas") };
                ahorros.forEach(ahorro => {
                    if (ahorro.dueño === usuario) {
                        cuen_aho = {
                            balance: ahorro.balance + "Bs",
                            intereses: ahorro.intereses + "%",
                            numero_cuenta: ahorro.numero_cuenta,
                        }
                    }
                });
                prestamos.forEach(prestamo => {
                    if (prestamo.dueño === usuario) {
                        cuen_pre = {
                            balance: prestamo.balance + "Bs",
                            intereses: prestamo.intereses + "%",
                            estado: prestamo.estado,
                            numero_cuenta: prestamo.numero_cuenta,
                        }
                    }
                });
                cooperativas_usuarios.forEach(relacion => {
                    if (relacion.usuario === usuario) {
                        cuen_cop.push(relacion)
                    }
                });
                //Calculamos las tasas de interes diarias (en el caso de las cooperativas no se calculan)
                cuen_aho.tasa_diaria = tasa_interes_diaria(cuen_aho.intereses, cuen_aho.balance).toFixed(2) + "Bs"
                cuen_pre.tasa_diaria = tasa_interes_diaria(cuen_pre.intereses, cuen_pre.balance).toFixed(2) + "Bs"
                if (cuen_aho.balance === undefined) {
                    cuen_aho = "No tiene cuentas de ahorro"
                }
                if (cuen_pre.balance === undefined) {
                    cuen_pre = "No tiene cuentas de prestamo"
                }
                if (cuen_cop.length === 0) {
                    cuen_cop = "No tiene cuentas de cooperativas"
                }
                return resolve({
                    mensaje: "Cuentas del usuario " + usuario,
                    data: {
                        usuario: {
                            nombre: consultado.nombre,
                            apellido: consultado.apellido,
                            cedula: consultado.cedula,
                            correo: consultado.correo
                        },
                        cuentas: {
                            ahorros: cuen_aho,
                            prestamos: cuen_pre,
                            cooperativas: cuen_cop
                        }
                    }
                })
            } catch (error) {
                return reject(error);
            }
        });
    }

    agregar(usuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula'
                )
                if (!usuario.nombre || !usuario.apellido || !usuario.cedula || !usuario.correo || !usuario.usuario || !usuario.contraseña) {
                    return reject("Faltan datos escenciales para ingresar al usuario")
                }
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === usuario.usuario) {
                        return reject("Ya esta en uso ese usuario")
                    }
                }
                let validacion = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;
                if (validacion.test(usuario.contraseña)) {
                    let nuevo_usuario = {
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        cedula: usuario.cedula,
                        correo: usuario.correo,
                        usuario: usuario.usuario,
                        contraseña: usuario.contraseña
                    }
                    const usuarioCreado = await UsuaiosModel.create(nuevo_usuario)
                    if (!usuarioCreado) {
                        return reject('Hubo un error al crear el nuevo usuario')
                    }
                    resolve({
                        mensaje: "Se ha registrado con éxito en el Banco",
                        data: usuario.usuario
                    })
                } else {
                    return reject("La contraseña debe tener 1 letra, 1 mayúscula, 1 número y un mínimo de 8 digitos")
                }
            } catch (error) {
                return reject(error);
            }
        })
    };

    resumen() {
        return new Promise(async (resolve, reject) => {
            try {
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                let capital_ahorros = 0
                let tasa_total_ahorros = 0
                for (let i = 0; i < ahorros.length; i++) {
                    capital_ahorros = capital_ahorros + ahorros[i].balance
                    tasa_total_ahorros = tasa_total_ahorros + ahorros[i].intereses
                }
                let capital_prestamos = 0
                let tasa_total_prestamos = 0
                for (let a = 0; a < prestamos.length; a++) {
                    capital_prestamos = capital_prestamos + prestamos[a].balance
                    tasa_total_prestamos = tasa_total_prestamos + prestamos[a].intereses
                }
                let capital_cooperativas = 0
                for (let e = 0; e < cooperativas.length; e++) {
                    capital_cooperativas = capital_cooperativas + cooperativas[e].balance
                }
                return resolve({
                    mensaje: "Listado con exito el capital total del banco en cada tipo de cuenta con su respectiva tasa de interes promedio",
                    data: {
                        cuentas_ahorros: {
                            capital: capital_ahorros + "Bs",
                            tasa_promedio: tasa_total_ahorros / (ahorros.length + 1) + "%"
                        },
                        cuentas_prestamos: {
                            capital: capital_prestamos + "Bs",
                            tasa_promedio: tasa_total_prestamos / (prestamos.length + 1) + "%"
                        },
                        grupos_cooperativas: {
                            capital: capital_cooperativas + "Bs",
                        }
                    }
                })
            } catch (error) {
                return reject(error);
            }
        })
    }

    editar(usuario, nuevo_usuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                if (!nuevo_usuario.contraseña || !nuevo_usuario.correo) {
                    return reject("Faltan datos escenciales para editar al usuario");
                }
                let validacion = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;
                if (validacion.test(nuevo_usuario.contraseña)) {
                    for (let i = 0; i < usuarios.length; i++) {
                        if (usuarios[i].usuario === usuario) {
                            const usuarioEditado = await UsuaiosModel.updateOne({ _id: usuarios[i]._id }, {
                                $set: {
                                    contraseña: nuevo_usuario.contraseña,
                                    correo: nuevo_usuario.correo
                                }
                            })
                            if (!usuarioEditado) {
                                return reject('Hubo un error al editar el usuario')
                            }
                            return resolve({
                                mensaje: "Editado con éxito el correo y la clave del usuario " + usuario,
                                data: {
                                    nombre: usuarios[i].nombre,
                                    apellido: usuarios[i].apellido,
                                    cedula: usuarios[i].cedula,
                                    correo: usuarios[i].correo,
                                    usuario: usuarios[i].usuario
                                }
                            })
                        }
                    }
                    return reject("No existe el usuario")
                } else {
                    return reject("La contraseña debe tener 1 letra, 1 mayúscula, 1 número y un mínimo de 8 digitos")
                }
            } catch (error) {
                return reject(error);
            }
        })
    };

    eliminar(usuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                const prestamos = await PrestamosModel.find().select(
                    '_id balance intereses monto_pago fecha_pago estado dueño'
                )
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                const cooperativas_usuarios = await RelacionCooperativasModel.find().select(
                    '_id usuario cooperativa fechas_cuotas balance'
                )
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === usuario) {
                        await UsuaiosModel.findByIdAndDelete(usuarios[i]._id)
                        for (let a = 0; a < ahorros.length; a++) {
                            if (ahorros[a].dueño === usuario) {
                                await AhorrosModel.findByIdAndDelete(ahorros[a]._id)
                            }
                        }
                        for (let e = 0; e < prestamos.length; e++) {
                            if (prestamos[e].dueño === usuario) {
                                await PrestamosModel.findByIdAndDelete(prestamos[e]._id)
                            }
                        }
                        for (let o = 0; o < cooperativas_usuarios.length; o++) {
                            if (cooperativas_usuarios[o].usuario === usuario) {
                                await RelacionCooperativasModel.findByIdAndDelete(cooperativas_usuarios[o]._id)
                            }
                        }
                        for (let u = 0; u < cooperativas.length; u++) {
                            for (let b = 0; b < cooperativas[u].usuarios_asociados.length; b++) {
                                if (cooperativas[u].usuarios_asociados[b] === usuario) {
                                    cooperativas[u].usuarios_asociados.splice(b, 1)
                                    await CooperativasModel.updateOne({ _id: cooperativas[u]._id }, {
                                        $set: {
                                            usuarios_asociados: cooperativas[u].usuarios_asociados
                                        }
                                    })
                                }
                            }
                        }
                        return resolve({
                            mensaje: "Se ha eliminado con exito el usuario " + usuario + " y todas sus cuentas en el Banco"
                        })
                    }
                }
                return reject("No existe el usuario que deseas eliminar")
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = new usuariosControllers();