const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AhorrosSchema = new Schema({
    id: ObjectId,
    balance: {
        type: Number
    },
    intereses: {
        type: Number
    },
    dueño: {
        type: String
    }
});

const AhorrosModel = mongoose.model('cuentas-ahorros', AhorrosSchema)
module.exports = AhorrosModel