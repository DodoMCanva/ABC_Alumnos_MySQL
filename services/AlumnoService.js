const pool = require('../config/database');
const Alumno = require('../models/Alumno');

class AlumnoService {
    static async listar() {
        const [rows] = await pool.query(`
    SELECT a.*, c.nombre as carrera_nombre
    FROM alumnos a
    LEFT JOIN alumno_carrera ac ON a.id = ac.alumno_id
    LEFT JOIN carreras c ON ac.carrera_id = c.id
    ORDER BY a.id
  `);

        return rows.map(row =>
            new Alumno(row.id, row.nombre, row.carrera_nombre || null)
        );
    }

    static async agregar(nombre) {
        const [result] = await pool.query('INSERT INTO alumnos (nombre) VALUES (?)', [nombre]);
        return new Alumno(result.insertId, nombre);
    }

    static async borrar(id) {
        await pool.query('DELETE FROM alumno_carrera WHERE alumno_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM alumnos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async actualizar(id, nombre) {
        const [result] = await pool.query('UPDATE alumnos SET nombre = ? WHERE id = ?', [nombre, id]);
        return result.affectedRows > 0;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM alumnos WHERE id = ?', [id]);
        return rows[0] ? new Alumno(rows[0].id, rows[0].nombre) : null;
    }
}

module.exports = AlumnoService;
