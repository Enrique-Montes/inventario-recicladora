let usuario = '';
let clave = '';
let rol = '';

function iniciarSesion() {
  usuario = document.getElementById("usuario").value;
  clave = document.getElementById("clave").value;

  fetch('/api/materiales', {
    headers: {
      'usuario': usuario,
      'clave': clave
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Credenciales inválidas');

      rol = (usuario === 'admin') ? 'admin' : 'usuario';

      document.getElementById("login").classList.add("oculto");
      document.getElementById("inventario").classList.remove("oculto");
      document.getElementById("cerrarSesionContainer").classList.remove("oculto"); // ✅ aquí

      if (rol === 'admin') {
        document.getElementById("formulario").classList.remove("oculto");
        document.querySelector(".admin-columna").style.display = "table-cell";
      } else {
        document.querySelector(".admin-columna").style.display = "none";
      }

      cargarMateriales();
    })
    .catch(err => alert(err.message));
}

function cargarMateriales() {
  fetch('/api/materiales', {
    headers: {
      'usuario': usuario,
      'clave': clave
    }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("materialList");
      tbody.innerHTML = '';
      data.forEach((mat, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${mat.nombre}</td>
          <td>${mat.cajas}</td>
          <td>${mat.tara} kg</td>
          <td>${mat.neto} kg</td>
          <td>${mat.estado}</td>
          ${rol === 'admin' ? `<td><button onclick="eliminar(${index})">Eliminar</button></td>` : ''}
        `;
        tbody.appendChild(fila);
      });
    });
}

document.getElementById("materialForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const cajas = document.getElementById("cajas").value;
  const tara = document.getElementById("tara").value;
  const neto = document.getElementById("neto").value;
  const estado = document.getElementById("estado").value;

  fetch('/api/materiales', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'usuario': usuario,
      'clave': clave
    },
    body: JSON.stringify({ nombre, cajas, tara, neto, estado })
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado');
      cargarMateriales();
      this.reset();
    })
    .catch(err => alert(err.message));
});

function eliminar(id) {
  fetch(`/api/materiales/${id}`, {
    method: 'DELETE',
    headers: {
      'usuario': usuario,
      'clave': clave
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado');
      cargarMateriales();
    })
    .catch(err => alert(err.message));
}

function cerrarSesion() {
  usuario = '';
  clave = '';
  rol = '';

  document.getElementById("login").classList.remove("oculto");
  document.getElementById("formulario").classList.add("oculto");
  document.getElementById("inventario").classList.add("oculto");
  document.getElementById("cerrarSesionContainer").classList.add("oculto"); // ✅ aquí

  // Limpiar inputs
  document.getElementById("usuario").value = '';
  document.getElementById("clave").value = '';
}
