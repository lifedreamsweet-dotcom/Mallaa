// Lista de cursos con sus prerrequisitos
const cursos = [
  { nombre: "Introducción al Derecho", abre: ["Bases Romanísticas del Derecho"] },
  { nombre: "Desempeño Universitario", abre: ["Redacción General"] },
  { nombre: "Matemática General", abre: ["Contabilidad General"] },
  { nombre: "Lengua y Comunicación", abre: ["Redacción General"] },
  { nombre: "Filosofía", abre: ["Derecho Penal - Parte General"] },
  { nombre: "Psicología General", abre: [] },
  { nombre: "Empresa Sociedad y Gobierno", abre: ["Derecho Constitucional I"] },
  { nombre: "Bases Romanísticas del Derecho", abre: ["Personas Naturales y Jurídicas"] },
  { nombre: "Derecho Penal - Parte General", abre: ["Introducción a la Investigación"] },
  { nombre: "Contabilidad General", abre: ["Economía I"] },
  { nombre: "Redacción General", abre: ["Inglés"] },
  { nombre: "Realidad Nacional", abre: ["Educación Ambiental"] },
  { nombre: "Derecho Constitucional I", abre: ["Derecho Constitucional II", "Introducción a la Ciencia Política"] },
  { nombre: "Personas Naturales y Jurídicas", abre: ["Derechos Reales"] },
  { nombre: "Introducción a la Investigación", abre: ["Acto Jurídico"] },
  { nombre: "Educación Ambiental", abre: ["Derecho Ambiental"] },
  { nombre: "Introducción a la Ciencia Política", abre: ["Derecho Administrativo I"] },
  { nombre: "Economía I", abre: ["Derecho Penal II"] },
  { nombre: "Inglés", abre: ["Taller de Liderazgo y Habilidades Jurídicas"] },
  { nombre: "Derecho Constitucional II", abre: [] },
  // ... puedes seguir completando aquí el resto de los cursos
];

// Estado de los cursos
const estadoCursos = {};

const contenedor = document.getElementById("malla");

// Crear botones de cursos
cursos.forEach((curso) => {
  const boton = document.createElement("button");
  boton.classList.add("curso");
  boton.textContent = curso.nombre;
  boton.disabled = true;
  estadoCursos[curso.nombre] = {
    aprobado: false,
    requisitos: [],
    boton: boton
  };
  contenedor.appendChild(boton);
});

// Asignar requisitos inversos (quién abre a quién)
cursos.forEach((curso) => {
  curso.abre.forEach((nombreCursoDestino) => {
    if (estadoCursos[nombreCursoDestino]) {
      estadoCursos[nombreCursoDestino].requisitos.push(curso.nombre);
    }
  });
});

// Activar cursos sin requisitos
Object.entries(estadoCursos).forEach(([nombre, data]) => {
  if (data.requisitos.length === 0) {
    activarCurso(nombre);
  }
});

// Función para activar un curso
function activarCurso(nombre) {
  const data = estadoCursos[nombre];
  if (!data.aprobado) {
    data.boton.disabled = false;
    data.boton.classList.add("activo");
    data.boton.addEventListener("click", () => aprobarCurso(nombre));
  }
}

// Aprobar curso y desbloquear los que dependan de él
function aprobarCurso(nombre) {
  const data = estadoCursos[nombre];
  if (data.aprobado) return;

  data.aprobado = true;
  data.boton.classList.remove("activo");
  data.boton.classList.add("aprobado");
  data.boton.disabled = true;

  // Desbloquear cursos que dependan de este
  cursos.forEach((curso) => {
    if (curso.requisitos && curso.requisitos.length > 0) {
      const requisitosAprobados = estadoCursos[curso.nombre].requisitos.every(
        (req) => estadoCursos[req]?.aprobado
      );
      if (requisitosAprobados) {
        activarCurso(curso.nombre);
      }
    }
  });

  // También desbloquear según el "abre" actual
  cursos
    .find((c) => c.nombre === nombre)
    ?.abre.forEach((dest) => {
      const requisitos = estadoCursos[dest].requisitos;
      const todosCumplidos = requisitos.every((req) => estadoCursos[req]?.aprobado);
      if (todosCumplidos) {
        activarCurso(dest);
      }
    });
}

