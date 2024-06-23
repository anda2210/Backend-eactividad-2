const mongoose = require('mongoose');

const MONGODB_HOST = '127.0.0.1:27017'
const MONGODB_DATABASE = 'banco-mercantil'

const MONGODB_URL = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`

mongoose.connect(MONGODB_URL)
.then(() => console.log('Se ha conectado existosamente la base de datos: ' + MONGODB_DATABASE))
.catch((error) => console.log('No se pudo conectar a Mongo por el siguiente error: ' + error))