document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header shrink
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
document.getElementById('mainNav').querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Menu tabs
const tabs = document.querySelectorAll('.menu-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const bg = item.style.backgroundImage.slice(5, -2);
    lightboxImg.src = bg;
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
  });
});

document.getElementById('lightboxClose').addEventListener('click', () => {
  lightbox.classList.remove('open');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// Reservation form -> WhatsApp
const RESTAURANT_WHATSAPP = '18095550123'; // reemplazar con el número real (código de país sin +)

const reservaForm = document.getElementById('reservaForm');
const formNote = document.getElementById('formNote');

reservaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(reservaForm);
  const nombre = data.get('nombre').trim();
  const telefono = data.get('telefono').trim();
  const fecha = data.get('fecha');
  const hora = data.get('hora');
  const personas = data.get('personas');
  const mensaje = data.get('mensaje').trim();

  const texto =
    `Hola, soy ${nombre}. Quisiera reservar una mesa para ${personas} persona(s) ` +
    `el ${fecha} a las ${hora}. Mi teléfono es ${telefono}.` +
    (mensaje ? ` Notas: ${mensaje}` : '');

  const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
  formNote.textContent = '¡Listo! Te llevamos a WhatsApp para confirmar tu reserva.';
  reservaForm.reset();
});

// Reveal on scroll
const revealTargets = document.querySelectorAll('.section, .hero-content');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});
