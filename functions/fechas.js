function fecha() {
    //Creamos la fecha de hoy
    let fecha = new Date();
    let fechaInicio = ''
    if ((fecha.getMonth() + 1) > 9 && (fecha.getDate()) > 9) {
        fechaInicio = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) < 9 && (fecha.getDate()) > 9) {
        fechaInicio = fecha.getFullYear() + "-" + "0" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) > 9 && (fecha.getDate()) < 9) {
        fechaInicio = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-0" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) < 9 && (fecha.getDate()) < 9) {
        fechaInicio = fecha.getFullYear() + "-" + "0" + (fecha.getMonth() + 1) + "-0" + fecha.getDate();
    }
    let fecha_nueva = new Date(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate());
    //dias a sumar
    let dias = 30;
    //nueva fecha 
    fecha_nueva.setDate(fecha_nueva.getDate() + dias);
    let fechaFin = ''
    if ((fecha_nueva.getMonth() + 1) > 9 && (fecha_nueva.getDate()) > 9) {
        fechaFin = fecha_nueva.getFullYear() + "-" + (fecha_nueva.getMonth() + 1) + "-" + fecha_nueva.getDate();
    }
    if ((fecha_nueva.getMonth() + 1) < 9 && (fecha_nueva.getDate()) > 9) {
        fechaFin = fecha_nueva.getFullYear() + "-" + "0" + (fecha_nueva.getMonth() + 1) + "-" + fecha_nueva.getDate();
    }
    if ((fecha_nueva.getMonth() + 1) > 9 && (fecha_nueva.getDate()) < 9) {
        fechaFin = fecha_nueva.getFullYear() + "-" + (fecha_nueva.getMonth() + 1) + "-0" + fecha_nueva.getDate();
    }
    if ((fecha_nueva.getMonth() + 1) < 9 && (fecha_nueva.getDate()) < 9) {
        fechaFin = fecha_nueva.getFullYear() + "-" + "0" + (fecha_nueva.getMonth() + 1) + "-0" + fecha_nueva.getDate();
    }

    return fechaFin
}

function programacion_cuotas_semanal(fecha) {
    const fechas = []
    let fechaInicio = new Date(fecha);
    fechas.push(fecha)
    let dias = 7;
    for (let i = 1; i < 10; i++) {
        let fecha_nueva = new Date(fechaInicio.getFullYear() + "-" + (fechaInicio.getMonth() + 1) + "-" + fechaInicio.getDate());
        fecha_nueva.setDate(fecha_nueva.getDate() + dias);
        if ((fecha_nueva.getMonth() + 1) > 9 && (fecha_nueva.getDate()) > 9) {
            fechaFin = fecha_nueva.getFullYear() + "-" + (fecha_nueva.getMonth() + 1) + "-" + fecha_nueva.getDate();
        }
        if ((fecha_nueva.getMonth() + 1) < 9 && (fecha_nueva.getDate()) > 9) {
            fechaFin = fecha_nueva.getFullYear() + "-" + "0" + (fecha_nueva.getMonth() + 1) + "-" + fecha_nueva.getDate();
        }
        if ((fecha_nueva.getMonth() + 1) > 9 && (fecha_nueva.getDate()) < 9) {
            fechaFin = fecha_nueva.getFullYear() + "-" + (fecha_nueva.getMonth() + 1) + "-0" + fecha_nueva.getDate();
        }
        if ((fecha_nueva.getMonth() + 1) < 9 && (fecha_nueva.getDate()) < 9) {
            fechaFin = fecha_nueva.getFullYear() + "-" + "0" + (fecha_nueva.getMonth() + 1) + "-0" + fecha_nueva.getDate();
        }
        fechas.push(fechaFin)
        dias = dias + 7
    }
    return fechas
}

function fecha_hoy() {
    //Creamos la fecha de hoy
    let fecha = new Date();
    let fecha_hoy = ''
    if ((fecha.getMonth() + 1) > 9 && (fecha.getDate()) > 9) {
        fecha_hoy = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) < 9 && (fecha.getDate()) > 9) {
        fecha_hoy = fecha.getFullYear() + "-" + "0" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) > 9 && (fecha.getDate()) < 9) {
        fecha_hoy = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-0" + fecha.getDate();
    }
    if ((fecha.getMonth() + 1) < 9 && (fecha.getDate()) < 9) {
        fecha_hoy = fecha.getFullYear() + "-" + "0" + (fecha.getMonth() + 1) + "-0" + fecha.getDate();
    }
    return fecha_hoy
}

module.exports = {
    fecha,
    programacion_cuotas_semanal,
    fecha_hoy
}