const estructura = [
  {
    anio: "PRIMER AÑO",
    ciclos: [
      {
        ciclo: "I CICLO",
        cursos: [
          { nombre: "Introducción al Derecho", abre: ["Bases Romanísticas del Derecho"] },
          { nombre: "Desempeño Universitario", abre: ["Redacción General"] },
          { nombre: "Matemática General", abre: ["Contabilidad General"] },
          { nombre: "Lengua y Comunicación", abre: ["Redacción General"] },
          { nombre: "Filosofía", abre: ["Derecho Penal - Parte General"] },
          { nombre: "Psicología General", abre: [] },
          { nombre: "Empresa Sociedad y Gobierno", abre: ["Derecho Constitucional I"] }
        ]
      },
      {
        ciclo: "II CICLO",
        cursos: [
          { nombre: "Bases Romanísticas del Derecho", abre: ["Personas Naturales y Jurídicas"] },
          { nombre: "Derecho Penal - Parte General", abre: ["Introducción a la Investigación"] },
          { nombre: "Contabilidad General", abre: ["Economía I"] },
          { nombre: "Redacción General", abre: ["Inglés"] },
          { nombre: "Realidad Nacional", abre: ["Educación Ambiental"] },
          { nombre: "Derecho Constitucional I", abre: ["Derecho Constitucional II", "Introducción a la Ciencia Política"] }
        ]
      }
    ]
  },
  {
    anio: "SEGUNDO AÑO",
    ciclos: [
      {
        ciclo: "III CICLO",
        cursos: [
          { nombre: "Personas Naturales y Jurídicas", abre: ["Derechos Reales"] },
          { nombre: "Introducción a la Investigación", abre: ["Acto Jurídico"] },
          { nombre: "Educación Ambiental", abre: ["Derecho Ambiental"] },
          { nombre: "Introducción a la Ciencia Política", abre: ["Derecho Administrativo I"] },
          { nombre: "Economía I", abre: ["Derecho Penal II"] },
          { nombre: "Inglés", abre: ["Taller de Liderazgo y Habilidades Jurídicas"] },
          { nombre: "Derecho Constitucional II", abre: [] }
        ]
      },
      {
        ciclo: "IV CICLO",
        cursos: [
          { nombre: "Derechos Reales", abre: ["Derecho de Obligaciones"] },
          { nombre: "Derecho Administrativo I", abre: ["Derecho Administrativo II"] },
          { nombre: "Derecho Penal II", abre: ["Derecho Procesal Penal I"] },
          { nombre: "Derecho Ambiental", abre: ["Derecho Procesal Civil I"] },
          { nombre: "Acto Jurídico", abre: ["Derecho Laboral General"] },
          { nombre: "Taller de Liderazgo y Habilidades Jurídicas", abre: ["Mecanismos Alternativos de Solución de Controversias"] }
        ]
      }
    ]
  }
  // Puedes continuar con TERCER, CUARTO y QUINTO AÑO aquí...
];

const estadoCursos = {};
const malla = document.getElementById("malla");

estructura.forEach((anioData) => {
  const contAnio = document.createElement("div");
  contAnio.classList.add("anio");

  const tituloAnio = document.createElement("div");
  tituloAnio.classList.add("titulo-anio");
  tituloAnio.textContent = anioData.anio;
  contAnio.appendChild(tituloAnio);

  anioData.ciclos.forEach((cicloData) => {
    const contCiclo = document.createElement("div");
    contCiclo.classList.add("ciclo");

    const tituloCiclo = document.createElement("div");
    tituloCiclo.classList.add("titulo-ciclo");
    tituloCiclo.textContent = cicloData.ciclo;
    contCiclo.appendChild(tituloCiclo);

    const contCursos = document.createElement("div");
    contCursos.classList.add("cursos");

    cicloData.cursos.forEach((curso) => {
      const boton = document.createElement("button");
      boton.classList.add("curso");
      boton.textContent = curso.nombre;
      boton.disabled = true;

      estadoCursos[curso.nombre] = {
        aprobado: false,
        requisitos: [],
        boton: boton
      };

      contCursos.appendChild(boton);
    });

    contCiclo.appendChild(contCursos);
    contAnio.appendChild(contCiclo);
  });

  malla.appendChild(contAnio);
});

// Asignar requisitos inversos
estructura.forEach((anio) => {
  anio.ciclos.forEach((ciclo) => {
    ciclo.cursos.forEach((curso) => {
      curso.abre.forEach((nombreCursoDestino) => {
        if (estadoCursos[nombreCursoDestino]) {
          estadoCursos[nombreCursoDestino].requisitos.push(curso.nombre);
        }
      });
    });
  });
});

// Activar cursos sin requisitos
Object.entries(estadoCursos).forEach(([nombre, data]) => {
  if (data.requisitos.length === 0) {
    activarCurso(nombre);
  }
});

function activarCurso(nombre) {
  const data = estadoCursos[nombre];
  if (!data.aprobado) {
    data.boton.disabled = false;
    data.boton.classList.add("activo");
    data.boton.addEventListener("click", () => aprobarCurso(nombre));
  }
}

function aprobarCurso(nombre) {
  const data = estadoCursos[nombre];
  if (data.aprobado) return;

  data.aprobado = true;
  data.boton.classList.remove("activo");
  data.boton.classList.add("aprobado");
  data.boton.disabled = true;

  // Verifica desbloqueos por requisitos
  Object.entries(estadoCursos).forEach(([nombreDestino, destinoData]) => {
    const requisitosCumplidos = destinoData.requisitos.every((req) => estadoCursos[req]?.aprobado);
    if (!destinoData.aprobado && requisitosCumplidos) {
      activarCurso(nombreDestino);
    }
  });
}
