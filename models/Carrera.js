class Carrera {
    constructor(id, nombre, alumnos = []) {
        this.id = id;
        this.nombre = nombre;
        this.alumnos = alumnos;
    }
}

module.exports = Carrera;
