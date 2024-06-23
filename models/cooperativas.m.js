const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CooperativasSchema = new Schema({
    id: ObjectId,
    balance: {
        type: Number
    },
    cuota: {
        type: Number
    },
    duracion: {
        type: Number
    },
    modalidad: {
        type: String
    },
    fecha_inicio:{
        type: String
    },
    usuarios_asociados: {
        type: Array
    },
    fechas_cuotas: {
        type: Array
    }
});

const CooperativasModel = mongoose.model('grupos-cooperativas', CooperativasSchema)
module.exports = CooperativasModel