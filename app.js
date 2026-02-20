const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const AlumnoService = require('./services/AlumnoService');
const CarreraService = require('./services/CarreraService');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas API Alumnos
app.get('/api/alumnos', async (req, res) => {
    const alumnos = await AlumnoService.listar();
    res.json(alumnos);
});

app.post('/api/alumnos', async (req, res) => {
    const { nombre } = req.body;
    const alumno = await AlumnoService.agregar(nombre);
    res.json(alumno);
});

app.delete('/api/alumnos/:id', async (req, res) => {
    const ok = await AlumnoService.borrar(req.params.id);
    res.json({ success: ok });
});

app.put('/api/alumnos/:id', async (req, res) => {
    const { nombre } = req.body;
    const ok = await AlumnoService.actualizar(req.params.id, nombre);
    res.json({ success: ok });
});

// Rutas API Carreras
app.get('/api/carreras', async (req, res) => {
    const carreras = await CarreraService.listar();
    res.json(carreras);
});

app.post('/api/carreras', async (req, res) => {
    const { nombre } = req.body;
    const carrera = await CarreraService.agregar(nombre);
    res.json(carrera);
});

app.delete('/api/carreras/:id', async (req, res) => {
    const ok = await CarreraService.borrar(req.params.id);
    res.json({ success: ok });
});

app.put('/api/carreras/:id', async (req, res) => {
    const { nombre } = req.body;
    const ok = await CarreraService.actualizar(req.params.id, nombre);
    res.json({ success: ok });
});

// Asignar alumno a carrera
app.post('/api/asignar', async (req, res) => {
    const { alumnoId, carreraId } = req.body;
    const ok = await CarreraService.asignarAlumno(alumnoId, carreraId);
    res.json({ success: ok });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
