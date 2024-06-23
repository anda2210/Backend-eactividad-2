const AhorrosModel = require('../models/ahorros.m');
const UsuaiosModel = require('../models/usuarios.m');

class ahorrosControllers {
    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                if (ahorros.length === 0) {
                    return reject('No hay cuentas de ahorros registradas en el Banco')
                }
                const data = []
                ahorros.forEach(ahorro => {
                    data.push({
                        balance: ahorro.balance + "Bs",
                        intereses: ahorro.intereses + "%",
                        dueño: ahorro.dueño,
                        numero_cuenta: ahorro._id
                    })
                });
                return resolve({
                    data: data,
                    mensaje: "Listado con éxito las cuentas de ahorros"
                })
            } catch (error) {
                return reject(error);
            }
        });
    };

    agregar(ahorro) {
        return new Promise(async (resolve, reject) => {
            try {
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                const usuarios = await UsuaiosModel.find().select(
                    '_id nombre apellido usuario correo cedula'
                )
                if (!ahorro.dueño || !ahorro.balance || !ahorro.intereses) {
                    return reject("Faltan propiedades escenciales para agregar la cuenta")
                }
                for (let a = 0; a < ahorros.length; a++) {
                    if (ahorros[a].dueño === ahorro.dueño) {
                        return reject("Ya este usuario posee una cuenta de Ahorros")
                    }
                }
                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].usuario === ahorro.dueño) {
                        let nuevo = {
                            balance: Number(ahorro.balance),
                            intereses: Number(ahorro.intereses),
                            dueño: ahorro.dueño,
                        }
                        const cuenta_nueva = await AhorrosModel.create(nuevo)
                        if (!cuenta_nueva) {
                            return reject('Hubo un error al crear la nueva cuenta de ahorro')
                        }
                        return resolve({
                            mensaje: "Se ha agregado con éxito la cuenta de ahorro al usuario " + ahorro.dueño,
                            data: {
                                balance: cuenta_nueva.balance + "Bs",
                                intereses: cuenta_nueva.intereses + "%",
                                dueño: cuenta_nueva.dueño,
                                numero_cuenta: cuenta_nueva._id
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

    editar(ahorro, cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                if (!ahorro.intereses || !ahorro.balance) {
                    return reject("Faltan propiedades escenciales para agregar la cuenta")
                }
                for (let i = 0; i < ahorros.length; i++) {
                    if (ahorros[i]._id == cuenta) {
                        ahorros[i].intereses = ahorro.intereses
                        ahorros[i].balance = ahorro.balance
                        const cuentaEditada = await AhorrosModel.updateOne({ _id: cuenta }, { $set: ahorros[i] })
                        if (!cuentaEditada) {
                            return reject('Hubo un error al editar la cuenta')
                        }
                        return resolve({
                            mensaje: "Editado con exito la cuenta de ahorros",
                            data: {
                                balance: ahorros[i].balance + "Bs",
                                intereses: ahorros[i].intereses + "%",
                                dueño: ahorros[i].dueño,
                                numero_cuenta: ahorros[i]._id
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

    eliminar(cuenta) {
        return new Promise(async (resolve, reject) => {
            try {
                const ahorros = await AhorrosModel.find().select(
                    '_id balance intereses dueño'
                )
                for (let i = 0; i < ahorros.length; i++) {
                    if (ahorros[i]._id == cuenta) {
                        const cuentaEliminada = await AhorrosModel.findByIdAndDelete(cuenta)
                        if (!cuentaEliminada) {
                            return reject('Hubo un error al eliminar la cuenta')
                        }
                        return resolve({
                            mensaje: "Se ha eliminado con exito la cuenta de ahorro " + cuenta
                        })
                    }
                }
                return reject("No existe la cuenta de ahorro que desea eliminar")
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = new ahorrosControllers();