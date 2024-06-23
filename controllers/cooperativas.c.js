const { v4: uuidv4 } = require('uuid');
const { cooperativas, usuarios, cooperativas_usuarios } = require('../database/database');
const { programacion_cuotas_semanal, fecha_hoy } = require('../functions/fechas');

class cooperativasControllers {
    listar() {
        return new Promise((resolve, reject) => {
            try {
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
                        numero_cuenta: cooperativa.numero_cuenta,
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
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i].numero_cuenta === cuenta) {
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
        return new Promise((resolve, reject) => {
            try {
                if (!cooperativa.cuota || !cooperativa.modalidad || !cooperativa.duracion || !cooperativa.fecha_inicio) {
                    return reject("Faltan propiedades escenciales para agregar el grupo")
                }
                if (cooperativa.modalidad != "Semanas") {
                    return reject("La modalidad debe ser: Semanas")
                }
                let nuevo_grupo = {
                    balance: 0,
                    cuota: cooperativa.cuota,
                    modalidad: cooperativa.modalidad,
                    duracion: cooperativa.duracion,
                    fecha_inicio: cooperativa.fecha_inicio,
                    fechas_cuotas: programacion_cuotas_semanal(cooperativa.fecha_inicio),
                    numero_cuenta: uuidv4(),
                    usuarios_asociados: []
                }
                cooperativas.push(nuevo_grupo);
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
        return new Promise((resolve, reject) => {
            try {
                if (!cooperativa.cuota || !cooperativa.balance) {
                    return reject("Faltan propiedades escenciales para editar el Grupo de Cooperativa")
                }
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i].numero_cuenta === cuenta) {
                        cooperativas[i].cuota = cooperativa.cuota
                        cooperativas[i].balance = cooperativa.balance
                        return resolve({
                            mensaje: "Editado con exito el Grupo de Cooperativa",
                            data: {
                                balance: cooperativas[i].balance + "Bs",
                                cuota: cooperativas[i].cuota + "Bs",
                                modalidad: cooperativas[i].modalidad,
                                duracion: cooperativas[i].duracion,
                                fecha_inicio: cooperativas[i].fecha_inicio,
                                fechas_cuotas: cooperativas[i].fechas_cuotas,
                                numero_cuenta: cooperativas[i].numero_cuenta,
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
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === usuario) {
                        for (let a = 0; a < cooperativas.length; a++) {
                            if (cooperativas[a].numero_cuenta === cooperativa) {
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
                                cooperativas_usuarios.push(relacion);
                                cooperativas[a].usuarios_asociados.push(usuario)
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
        return new Promise((resolve, reject) => {
            try {
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
                    if (cooperativas[i].numero_cuenta === cuenta) {
                        for (let a = 0; a < cooperativas[i].usuarios_asociados.length; a++) {
                            if (cooperativas[i].usuarios_asociados[a] === usuario) {
                                cooperativas[i].usuarios_asociados.splice(a, 1)
                                for (let e = 0; e < cooperativas_usuarios.length; e++) {
                                    if (cooperativas_usuarios[e].usuario === usuario && cooperativas_usuarios[e].cooperativa === cuenta) {
                                        cooperativas_usuarios.splice(e, 1)
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
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < cooperativas.length; i++) {
                    if (cooperativas[i].numero_cuenta === cuenta) {
                        cooperativas.splice(i, 1);
                        for (let a = 0; a < cooperativas_usuarios.length; a++) {
                            if (cooperativas_usuarios[a].cooperativa === cuenta) {
                                cooperativas_usuarios.splice(a, 1);
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