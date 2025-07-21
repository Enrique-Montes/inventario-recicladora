// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // sirve el frontend

// Base de datos simulada
let materiales = [];
let usuarios = [
  { usuario: "admin", clave: "Juan1017", rol: "admin" },
  { usuario: "luis", clave: "Rooster", rol: "usuario" },
  { usuario: "vero", clave: "Verosiul", rol: "usuario" }
];

// Middleware de autenticación básica
function autenticar(req, res, next) {
  const { usuario, clave } = req.headers;
  const encontrado = usuarios.find(u => u.usuario === usuario && u.clave === clave);
  if (!encontrado) return res.status(401).json({ error: "No autorizado" });
  req.usuario = encontrado;
  next();
}

// Obtener todos los materiales
app.get('/api/materiales', autenticar, (req, res) => {
  res.json(materiales);
});

// Agregar material (solo admin)
app.post('/api/materiales', autenticar, (req, res) => {
  if (req.usuario.rol !== 'admin') return res.status(403).json({ error: "Sin permisos" });
  materiales.push(req.body);
  res.json({ ok: true });
});

// Eliminar material (solo admin)
app.delete('/api/materiales/:id', autenticar, (req, res) => {
  if (req.usuario.rol !== 'admin') return res.status(403).json({ error: "Sin permisos" });
  const id = parseInt(req.params.id);
  if (materiales[id]) {
    materiales.splice(id, 1);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: "No encontrado" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
