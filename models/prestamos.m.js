const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PrestamosSchema = new Schema({
    id: ObjectId,
    balance: {
        type: Number
    },
    intereses: {
        type: Number
    },
    monto_pago: {
        type: Number
    },
    fecha_pago: {
        type: String
    },
    estado: {
        type: String
    },
    dueño: {
        type: String
    },
});

const PrestamosModel = mongoose.model('cuentas-prestamos', PrestamosSchema)
module.exports = PrestamosModel