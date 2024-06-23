const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RelacionSchema = new Schema({
    id: ObjectId,
    usuario: {
        type: String
    },
    cooperativa: {
        type: String
    },
    fechas_cuotas: {
        type: Array
    },
    balance: {
        type: Number
    }
});

const RelacionCooperativasModel = mongoose.model('relacion-usuarios-cooperativas', RelacionSchema)
module.exports = RelacionCooperativasModel