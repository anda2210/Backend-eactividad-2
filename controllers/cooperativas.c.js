const UsuaiosModel = require('../models/usuarios.m');
const CooperativasModel = require('../models/cooperativas.m');
const RelacionCooperativasModel = require('../models/relaciones.m');
const { programacion_cuotas_semanal, fecha_hoy } = require('../functions/fechas');

class cooperativasControllers {
    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                if (cooperativas.length === 0) {
                    return reject('No hay grupos de cooperativas registradas en el Banco')
                }
                const data = []
                cooperativas.forEach(cooperativa => {
                    data.push({
                        balance: cooperativa.balance + "Bs",
                        cuota: cooperativa.cuota + "Bs",
                        modalidad: cooperativa.modalidad,
                        duracion: cooperativa.duracion + " cuotas",
                        fecha_inicio: cooperativa.fecha_inicio,
                        numero_cuenta: cooperativa._id,
                        usuarios_asociados: cooperativa.usuarios_asociados
                    })
                });
                return resolve({
                    data: data,
                    mensaje: "Listado con éxito los grupos de cooperativas"
                })
            } catch (error) {
                return reject(error);
            }
        });
    }

    fecha_proxima(cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i]._id == cuenta) {
                        for (let a = 0; a < cooperativas[i].fechas_cuotas.length; a++) {
                            if (fecha_hoy() <= cooperativas[i].fechas_cuotas[a]) {
                                return resolve({
                                    mensaje: "Se ha encontrado con exito la proxima fecha de pago de esta cuenta",
                                    data: {
                                        numero_cuenta: cuenta,
                                        proxima_fecha: cooperativas[i].fechas_cuotas[a]
                                    }
                                })
                            }
                        }
                        return reject("Ya han pasado todas fechas de pago de esta cuenta de cooperativa")
                    }
                }
                return reject("No existe la cuenta que desea ver su fecha de pago")
            } catch (error) {
                return reject(error);
            }
        });
    }

    agregar(cooperativa) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!cooperativa.cuota || !cooperativa.modalidad || !cooperativa.duracion || !cooperativa.fecha_inicio) {
                    return reject("Faltan propiedades escenciales para agregar el grupo")
                }
                if (cooperativa.modalidad != "Semanas") {
                    return reject("La modalidad debe ser: Semanas")
                }
                let nuevo = {
                    balance: 0,
                    cuota: Number(cooperativa.cuota),
                    modalidad: cooperativa.modalidad,
                    duracion: Number(cooperativa.duracion),
                    fecha_inicio: cooperativa.fecha_inicio,
                    fechas_cuotas: programacion_cuotas_semanal(cooperativa.fecha_inicio),
                    usuarios_asociados: []
                }
                const nuevo_grupo = await CooperativasModel.create(nuevo)
                if (!nuevo_grupo) {
                    return reject('Hubo un error al crear lel nuevo grupo de cooperativa')
                }
                return resolve({
                    mensaje: "Se ha registrado con exito el grupo de cooperativa",
                    data: nuevo_grupo
                })
            } catch (error) {
                return reject(error);
            }
        });
    }

    editar(cooperativa, cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                if (!cooperativa.cuota || !cooperativa.balance) {
                    return reject("Faltan propiedades escenciales para editar el Grupo de Cooperativa")
                }
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i]._id == cuenta) {
                        cooperativas[i].cuota = cooperativa.cuota
                        cooperativas[i].balance = cooperativa.balance
                        const cuentaEditada = await CooperativasModel.updateOne({ _id: cuenta }, { $set: cooperativas[i] })
                        if (!cuentaEditada) {
                            return reject('Hubo un error al editar la cuenta')
                        }
                        return resolve({
                            mensaje: "Editado con exito el Grupo de Cooperativa",
                            data: {
                                balance: cooperativas[i].balance + "Bs",
                                cuota: cooperativas[i].cuota + "Bs",
                                modalidad: cooperativas[i].modalidad,
                                duracion: cooperativas[i].duracion,
                                fecha_inicio: cooperativas[i].fecha_inicio,
                                fechas_cuotas: cooperativas[i].fechas_cuotas,
                                numero_cuenta: cooperativas[i]._id,
                                usuarios_asociados: cooperativas[i].usuarios_asociados
                            }
                        })
                    }
                }
                return reject("No existe la cuenta que deseas editar")
            } catch (error) {
                return reject(error);
            }
        });
    }

    relacion_usuario(usuario, cooperativa) {
        return new Promise(async (resolve, reject) => {
            try {
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === usuario) {
                        for (let a = 0; a < cooperativas.length; a++) {
                            if (cooperativas[a]._id == cooperativa) {
                                for (let e = 0; e < cooperativas[a].usuarios_asociados.length; e++) {
                                    if (cooperativas[a].usuarios_asociados[e] === usuario) {
                                        return reject("No se puede agregar la relacion porque ya esta registrado el usuario al grupo de cooperativa")
                                    }
                                }
                                let relacion = {
                                    usuario: usuario,
                                    cooperativa: cooperativa,
                                    balance: 0,
                                    fechas_cuotas: programacion_cuotas_semanal(cooperativas[a].fecha_inicio)
                                }
                                const relacionCreada = await RelacionCooperativasModel.create(relacion)
                                if (!relacionCreada) {
                                    return reject('Hubo un error al crear la nueva relacion de usuario a una cooperativa')
                                }
                                cooperativas[a].usuarios_asociados.push(usuario)
                                await CooperativasModel.updateOne({ _id: cooperativa }, { $set: cooperativas[a] })
                                return resolve({
                                    mensaje: "Se ha agregado con exito al grupo de cooperativa al usuario " + usuario,
                                    data: relacion
                                })
                            }
                        }
                        return reject("No existe la cooperativa que deseas relacion con el usuario " + usuario)
                    }
                }
                return reject("No existe el usuario que deseas relacionar con esta cooperativa")
            } catch (error) {
                return reject(error);
            }
        });
    }

    eliminar_relacion(usuario, cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula contraseña'
                )
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                const cooperativas_usuarios = await RelacionCooperativasModel.find().select(
                    '_id usuario cooperativa fechas_cuotas balance'
                )
                let no_aparece = true
                for (let o = 0; o < usuarios.length; o++) {
                    if (usuarios[o].usuario === usuario) {
                        no_aparece = false
                    }
                }
                if (no_aparece) {
                    return reject("El usuario no esta regisrado en el banco")
                }
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i]._id == cuenta) {
                        for (let a = 0; a < cooperativas[i].usuarios_asociados.length; a++) {
                            if (cooperativas[i].usuarios_asociados[a] === usuario) {
                                cooperativas[i].usuarios_asociados.splice(a, 1)
                                await CooperativasModel.updateOne({ _id: cuenta }, { $set: cooperativas[i] })
                                for (let e = 0; e < cooperativas_usuarios.length; e++) {
                                    if (cooperativas_usuarios[e].usuario === usuario && cooperativas_usuarios[e].cooperativa === cuenta) {
                                        const relacionEliminada = await RelacionCooperativasModel.findByIdAndDelete(cooperativas_usuarios[e]._id)
                                        if (!relacionEliminada) {
                                            return reject('Hubo un error al eliminar la relacion del usuario a la cooperativa')
                                        }
                                        return resolve({
                                            mensaje: "El usuario " + usuario + " ya no pertenece a la cooperativa " + cuenta,
                                            data: {}
                                        })
                                    }
                                }
                            }
                        }
                        return reject("El usuario no se encuentra asociado a esta Cooperativa")
                    }
                }
                return reject("No existe la cuenta que deseas eliminar al usuario")
            } catch (error) {
                return reject(error);
            }
        });
    }

    eliminar(cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const cooperativas = await CooperativasModel.find().select(
                    '_id balance cuota duracion modalidad fecha_inicio usuarios_asociados fechas_cuotas'
                )
                const cooperativas_usuarios = await RelacionCooperativasModel.find().select(
                    '_id usuario cooperativa fechas_cuotas balance'
                )
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i]._id == cuenta) {
                        const cuentaEliminada = await CooperativasModel.findByIdAndDelete(cuenta)
                        if (!cuentaEliminada) {
                            return reject('Hubo un error al eliminar la cuenta')
                        }
                        for (let a = 0; a < cooperativas_usuarios.length; a++) {
                            if (cooperativas_usuarios[a].cooperativa == cuenta) {
                                const relacionEliminada = await RelacionCooperativasModel.findByIdAndDelete(cooperativas_usuarios[a]._id)
                                if (!relacionEliminada) {
                                    return reject('Hubo un error al eliminar la relacion del usuario a la cooperativa')
                                }
                            }
                        }
                        return resolve({
                            mensaje: "Se ha eliminado con exito la cuenta de Cooperativa " + cuenta
                        })
                    }
                }
                return reject("No existe la cuenta de Cooperativa que desea eliminar")
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = new cooperativasControllers();