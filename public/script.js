let alumnos = [], carreras = [];

// Cargar datos iniciales
async function cargarDatos() {
    alumnos = await fetch('/api/alumnos').then(r => r.json());
    carreras = await fetch('/api/carreras').then(r => r.json());
    renderAlumnos();
    renderCarreras();
    cargarSelectsAsignar();
}

// Renderizar tablas
function renderAlumnos() {
    const tbody = document.querySelector('#tablaAlumnos tbody');
    tbody.innerHTML = alumnos.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.nombre}</td>
      <td>
        <span style="color: ${a.carrera ? '#27ae60' : '#95a5a6'}; font-weight: bold;">
          ${a.carrera || 'Sin asignar'}
        </span>
      </td>
      <td>
        <button class="btn edit" onclick="editarAlumno(${a.id}, '${a.nombre}')">Editar</button>
        <button class="btn delete" onclick="borrarAlumno(${a.id})">Borrar</button>
      </td>
    </tr>
  `).join('');
}


function renderCarreras() {
    const tbody = document.querySelector('#tablaCarreras tbody');
    tbody.innerHTML = carreras.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td><strong>${typeof c.alumnos === 'number' ? c.alumnos : c.alumnos.length}</strong></td>
      <td>
        <button class="btn edit" onclick="editarCarrera(${c.id}, '${c.nombre}')">Editar</button>
        <button class="btn delete" onclick="borrarCarrera(${c.id})">Borrar</button>
      </td>
    </tr>
  `).join('');
}


// CRUD Alumnos
async function agregarAlumno(nombre) {
    await fetch('/api/alumnos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre }) });
    cargarDatos();
}

async function editarAlumno(id, nombre) {
    const nuevoNombre = prompt('Nuevo nombre:', nombre);
    if (nuevoNombre) {
        await fetch(`/api/alumnos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nuevoNombre }) });
        cargarDatos();
    }
}

async function borrarAlumno(id) {
    if (confirm('¿Borrar alumno?')) {
        await fetch(`/api/alumnos/${id}`, { method: 'DELETE' });
        cargarDatos();
    }
}

// CRUD Carreras (similar)
async function agregarCarrera(nombre) {
    await fetch('/api/carreras', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre }) });
    cargarDatos();
}

async function editarCarrera(id, nombre) {
    const nuevoNombre = prompt('Nuevo nombre:', nombre);
    if (nuevoNombre) {
        await fetch(`/api/carreras/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nuevoNombre }) });
        cargarDatos();
    }
}

async function borrarCarrera(id) {
    if (confirm('¿Borrar carrera?')) {
        await fetch(`/api/carreras/${id}`, { method: 'DELETE' });
        cargarDatos();
    }
}

// Asignar
async function asignarAlumno() {
    const aluId = document.getElementById('selectAlumno').value;
    const carId = document.getElementById('selectCarrera').value;
    if (aluId && carId) {
        await fetch('/api/asignar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alumnoId: aluId, carreraId: carId }) });
        cargarDatos();
        alert('Asignado correctamente');
    }
}

function cargarSelectsAsignar() {
    document.getElementById('selectAlumno').innerHTML = alumnos.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
    document.getElementById('selectCarrera').innerHTML = carreras.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

// Navegación y Modales
function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    document.getElementById(seccion).classList.add('activa');
}

function abrirModal(tipo) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modalBody');

    if (tipo === 'agregarAlumno') {
        body.innerHTML = `
      <h3>Agregar Alumno</h3>
      <form onsubmit="event.preventDefault(); const nombre = this.nombre.value; agregarAlumno(nombre); cerrarModal();">
        <div class="form-group">
          <label>Nombre:</label>
          <input name="nombre" required>
        </div>
        <button type="submit">Agregar</button>
      </form>
    `;
    } else if (tipo === 'agregarCarrera') {
        body.innerHTML = `
      <h3>Agregar Carrera</h3>
      <form onsubmit="event.preventDefault(); const nombre = this.nombre.value; agregarCarrera(nombre); cerrarModal();">
        <div class="form-group">
          <label>Nombre:</label>
          <input name="nombre" required>
        </div>
        <button type="submit">Agregar</button>
      </form>
    `;
    }
    modal.style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Inicializar
cargarDatos();
window.onclick = (e) => { if (e.target.id === 'modal') cerrarModal(); };
