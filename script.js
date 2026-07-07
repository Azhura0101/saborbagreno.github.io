console.log('Optimized By Azhura0101');

// -----------------------------------------------------------------
// 1. PLATO DESTACADO DEL DÍA (Actualización Dinámica del DOM)
// -----------------------------------------------------------------
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const platosDelDia = [
  {
    nombre: "Mondongo",
    imagen: "https://elrinconcolombiano.com/wp-content/uploads/2023/11/Mondongo-paisa-o-sopa-de-mondongo-o-callo.jpg",
    descripcion: "Sabor tradicional con un toque casero inigualable.",
    precio: "$20.000",
  },
  {
    nombre: "Bandeja De Res",
    imagen: "https://i0.wp.com/gastroturismord.com/wp-content/uploads/2023/05/aadd83f9a31b4b02b3ed5a5675b72cbf.jpg?resize=1000%2C566&ssl=1",
    descripcion: "Acompañado de arroz, frijoles, ensalada fresca, tajadas maduras y un delicioso jugo.",
    precio: "$14.000",
  },
  {
    nombre: "Bandeja De Cerdo",
    imagen: "https://i.postimg.cc/5tqJZkXG/549287fb-bae7-4e5f-8ae8-866056f741a1.png",
    descripcion: "Tradición antioqueña preparada con el mejor sazón y mucho amor.",
    precio: "$14.000",
  },
  {
    nombre: "Bandeja De Chicharron",
    imagen: "https://i.postimg.cc/bY79Vztm/aff501b7-5ad9-4da9-90ac-112f7a80b874.jpg",
    descripcion: "Chicharrón bien carnudo y crocante, acompañado de todo el sabor local.",
    precio: "$14.000",
  },
  {
    nombre: "Bandeja De Pechuga",
    imagen: "https://i.postimg.cc/L4xjGm3C/Whats-App-Image-2025-06-08-at-9-14-06-PM-Editado.png",
    descripcion: "Filete de pechuga jugoso a la plancha con sus acompañantes tradicionales.",
    precio: "$14.000",
  },
  {
    nombre: "Bandeja Paisa",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GvefrM5x6aymSyHOJNe_2opyiMOLwgDQbQ&s",
    descripcion: "El clásico de clásicos con todo el poder de nuestra tierra.",
    precio: "$20.000",
  },
  {
    nombre: "Pescado Tilapia o Robalo",
    imagen: "https://i.postimg.cc/kGWQ0SJk/b5d8b3fa-7f59-4008-ae23-fe02642933a6.png",
    descripcion: "Deliciosos filetes frescos preparados a la minuta, listos para disfrutar.",
    precio: "$20.000",
  }
];

const actualizarPlatoDelDia = () => {
  const hoy = new Date().getDay(); // 0: Domingo, 1: Lunes, etc.
  const plato = platosDelDia[hoy];

  const imgPlato = document.getElementById("featured-img");
  const nombrePlato = document.getElementById("featured-name");
  const descripcionPlato = document.getElementById("featured-desc");
  const precioPlato = document.getElementById("featured-price");
  const diaLabel = document.getElementById("featured-day");

  // Si algún plato falta en el arreglo, no rompemos la página: usamos el primero como respaldo.
  if (!plato) return;

  if (diaLabel) diaLabel.textContent = DIAS[hoy];

  if (imgPlato && nombrePlato && descripcionPlato && precioPlato) {
    // Evita mostrar una imagen rota si la URL llegara a fallar.
    imgPlato.onerror = () => {
      imgPlato.onerror = null;
      imgPlato.src = "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/XK2QMHCN4ZDYPLA4L7ONCJPJV4.jpg";
    };
    imgPlato.src = plato.imagen;
    imgPlato.alt = `Plato del día: ${plato.nombre}`;
    nombrePlato.textContent = plato.nombre;
    descripcionPlato.textContent = plato.descripcion;
    precioPlato.textContent = plato.precio;
  }
};

// -----------------------------------------------------------------
// 2. LÓGICA DE CARRUSELES (Botones de Desplazamiento)
// -----------------------------------------------------------------
const inicializarCarruseles = () => {
  document.querySelectorAll('.carousel-wrap').forEach(contenedor => {
    const carrusel = contenedor.querySelector('.carousel');
    const btnIzquierda = contenedor.querySelector('.carousel-btn.left');
    const btnDerecha = contenedor.querySelector('.carousel-btn.right');

    if (!carrusel || !btnIzquierda || !btnDerecha) return;

    // Desplazamiento al hacer clic
    btnIzquierda.addEventListener('click', () => {
      carrusel.scrollBy({ left: -320, behavior: 'smooth' });
    });

    btnDerecha.addEventListener('click', () => {
      carrusel.scrollBy({ left: 320, behavior: 'smooth' });
    });

    // Activa/desactiva flechas según si hay contenido para desplazar y en qué punto vamos.
    // (Antes solo se ocultaban una vez y nunca volvían a mostrarse al redimensionar).
    const actualizarEstadoFlechas = () => {
      const hayOverflow = carrusel.scrollWidth > carrusel.clientWidth + 1;

      if (!hayOverflow) {
        btnIzquierda.style.display = 'none';
        btnDerecha.style.display = 'none';
        return;
      }

      btnIzquierda.style.display = '';
      btnDerecha.style.display = '';

      const inicio = carrusel.scrollLeft <= 0;
      const final = carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 1;

      btnIzquierda.disabled = inicio;
      btnDerecha.disabled = final;
      btnIzquierda.classList.toggle('is-disabled', inicio);
      btnDerecha.classList.toggle('is-disabled', final);
    };

    carrusel.addEventListener('scroll', actualizarEstadoFlechas, { passive: true });

    // Las imágenes cargan de forma asíncrona y cambian scrollWidth,
    // así que revisamos también cuando termina de cargar la página.
    window.addEventListener('resize', actualizarEstadoFlechas);
    window.addEventListener('load', actualizarEstadoFlechas);
    actualizarEstadoFlechas();
  });
};

// -----------------------------------------------------------------
// 3. ANIMACIONES AL HACER SCROLL (Intersection Observer)
// -----------------------------------------------------------------
const inicializarAnimacionesScroll = () => {
  const elementos = document.querySelectorAll('.dish-card, .featured-card, .testimonial-card');
  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respetamos la preferencia de accesibilidad del sistema: sin animación de entrada.
  if (prefiereMenosMovimiento) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Deja de observar una vez animado
      }
    });
  }, { threshold: 0.1 });

  elementos.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
};

// -----------------------------------------------------------------
// 4. BARRA DE NAVEGACIÓN: sombra al hacer scroll + cierre de menú móvil
// -----------------------------------------------------------------
const inicializarNav = () => {
  const nav = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (nav) {
    const marcarScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', marcarScroll, { passive: true });
    marcarScroll();
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const abierto = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
    });

    links.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
};

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  actualizarPlatoDelDia();
  inicializarCarruseles();
  inicializarAnimacionesScroll();
  inicializarNav();
});