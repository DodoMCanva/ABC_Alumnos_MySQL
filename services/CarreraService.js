const pool = require('../config/database');
const Carrera = require('../models/Carrera');
const AlumnoService = require('./AlumnoService');

class CarreraService {
    static async listar() {
        const [rows] = await pool.query('SELECT * FROM carreras ORDER BY id');

        // Obtener conteo de alumnos POR carrera usando COUNT
        const [carrerasConConteo] = await pool.query(`
      SELECT c.*, 
             COUNT(ac.alumno_id) as total_alumnos
      FROM carreras c
      LEFT JOIN alumno_carrera ac ON c.id = ac.carrera_id
      GROUP BY c.id
      ORDER BY c.id
    `);

        const carreras = carrerasConConteo.map(row =>
            new Carrera(row.id, row.nombre, parseInt(row.total_alumnos) || 0)
        );

        return carreras;
    }

    static async agregar(nombre) {
        const [result] = await pool.query('INSERT INTO carreras (nombre) VALUES (?)', [nombre]);
        return new Carrera(result.insertId, nombre, 0); // 0 alumnos inicial
    }

    static async asignarAlumno(alumnoId, carreraId) {
        const [existing] = await pool.query(
            'SELECT * FROM alumno_carrera WHERE alumno_id = ? AND carrera_id = ?',
            [alumnoId, carreraId]
        );
        if (existing.length > 0) return false;

        await pool.query(
            'INSERT INTO alumno_carrera (alumno_id, carrera_id) VALUES (?, ?)',
            [alumnoId, carreraId]
        );
        return true;
    }

    static async asignarAlumno(alumnoId, carreraId) {
        const [existing] = await pool.query('SELECT * FROM alumno_carrera WHERE alumno_id = ? AND carrera_id = ?', [alumnoId, carreraId]);
        if (existing.length > 0) return false;
        await pool.query('INSERT INTO alumno_carrera (alumno_id, carrera_id) VALUES (?, ?)', [alumnoId, carreraId]);
        return true;
    }

    static async listarAlumnosSinCarrera() {
        return AlumnoService.listar().then(alumnos =>
            alumnos.filter(a => !a.carrera)
        );
    }
}

module.exports = CarreraService;
