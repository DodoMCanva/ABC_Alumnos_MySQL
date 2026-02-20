class Alumno {
    constructor(id, nombre, carrera = null) {
        this.id = id;
        this.nombre = nombre;
        this.carrera = carrera;
    }
}

module.exports = Alumno;
