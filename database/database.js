const usuarios = [
    {
        nombre: "Alexis",
        apellido: "Castro",
        cedula: "V30476044",
        correo: "alexis@gamil.com",
        usuario: "AlexisCastro",
        contraseña: "AlexisCastro"
    }
]

const ahorros = [
    {
        balance: 500,
        intereses: 5,
        dueño: "AlexisCastro",
        numero_cuenta: "12345543216789009876"
    }
]

const prestamos = [
    {
        balance: 1000,
        intereses: 10,
        estado: "Deuda",
        fecha_pago: "2024-06-28",
        monto_pago: 1008.34,
        dueño: "AlexisCastro",
        numero_cuenta: "12345678901234567890"
    }
]

const cooperativas = [
    {
        balance: 0,
        cuota: 100,
        modalidad: "Semanas",
        duracion: 10,
        fecha_inicio: "2024-05-31",
        numero_cuenta: "90909090901212121212",
        usuarios_asociados: ["AlexisCastro"],
        fechas_cuotas: ["2024-05-31", "2024-06-06", "2024-06-13", "2024-06-20", "2024-06-27", "2024-07-04", "2024-07-11", "2024-07-18", "2024-07-25", "2024-08-01"]
    }
]

const cooperativas_usuarios = [{
    usuario: "AlexisCastro",
    cooperativa: "90909090901212121212",
    balance: 0,
    fechas_cuotas: ["2024-05-31", "2024-06-06", "2024-06-13", "2024-06-20", "2024-06-27", "2024-07-04", "2024-07-11", "2024-07-18", "2024-07-25", "2024-08-01"]
}]

module.exports = {
    usuarios,
    ahorros,
    prestamos,
    cooperativas,
    cooperativas_usuarios
}