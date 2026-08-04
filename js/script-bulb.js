const {
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable } =
window;
registerPlugin(MorphSVGPlugin);

let startX;
let startY;
let IS_PLAYING = false;

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3') };

const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');
const WELCOME = document.getElementById('welcome');
const WHOAMI_P = document.querySelectorAll('#whoami p');
const MAIN = document.querySelector('main');
const CONTACT = document.getElementById('contact');
const air = document.querySelectorAll('.air');
const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');

const RESET = () => {
  set(PROXY, { x: ENDX, y: ENDY });
};

RESET();

const onStart = () => {
  IS_PLAYING = true;

  set(DUMMY, { display: 'none' });
  set(CORDS[0], { display: 'inline' });
  AUDIO.CLICK.play();
};

const onComplete = () => {
  set(DUMMY, { display: 'block' });
  set(CORDS[0], { display: 'none' });
  RESET();
  IS_PLAYING = false;
  openIdeaModal();
};

const buildTimeline = () => {
  const tl = timeline({ paused: true, onStart, onComplete });
  for (let i = 1; i < CORDS.length; i++) {
    tl.add(
      to(CORDS[0], {
        morphSVG: CORDS[i],
        duration: CORD_DURATION,
        repeat: 1,
        yoyo: true
      })
    );
  }
  return tl;
};

let CORD_TL = buildTimeline();

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x;
    startY = e.y;
  },
  onDrag: function () {
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y } });


  },
  onRelease: function (e) {
    const DISTX = Math.abs(e.x - startX);
    const DISTY = Math.abs(e.y - startY);
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
    to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50 && !IS_PLAYING) {
          CORD_TL.kill();
          CORD_TL = buildTimeline();
          CORD_TL.play();
        } else {
          RESET();
        }
      } });

  } });

WELCOME.classList.add('grow');

const WEB3FORMS_ACCESS_KEY = 'a6b3a2ca-d7a7-42bb-9f96-91c5c6f7d8b5';

const IDEA_MODAL = document.getElementById('idea-modal');
const IDEA_FORM = document.getElementById('idea-form');
const IDEA_TEXT = document.getElementById('idea-text');
const IDEA_EMAIL = document.getElementById('idea-email');
const IDEA_SUBMIT = document.getElementById('idea-submit');
const IDEA_STATUS = document.getElementById('idea-status');

const openIdeaModal = () => {
  if (!IDEA_MODAL) return;
  document.documentElement.classList.add('turn-on');
  IDEA_STATUS.textContent = '';
  IDEA_STATUS.classList.remove('success', 'error');
  IDEA_FORM.reset();
  setTimeout(() => IDEA_TEXT?.focus(), 350);
};

const closeIdeaModal = () => {
  const root = document.documentElement;
  if (!root.classList.contains('turn-on')) return;
  root.classList.remove('turn-on');
  root.classList.add('idea-off');
  setTimeout(() => root.classList.remove('idea-off'), 600);
};

IDEA_MODAL?.addEventListener('click', e => {
  if (e.target.closest('.idea-modal-content') && !e.target.closest('.idea-modal-close')) return;
  closeIdeaModal();
});

IDEA_FORM?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!IDEA_TEXT.value.trim()) {
    IDEA_STATUS.textContent = 'Contame primero tu idea';
    IDEA_STATUS.classList.add('error');
    IDEA_TEXT.focus();
    return;
  }
  if (WEB3FORMS_ACCESS_KEY === 'TU_ACCESS_KEY_AQUI') {
    IDEA_STATUS.textContent = 'Falta configurar el access_key de Web3Forms';
    IDEA_STATUS.classList.add('error');
    return;
  }

  IDEA_SUBMIT.disabled = true;
  IDEA_STATUS.textContent = 'Enviando...';
  IDEA_STATUS.classList.remove('success', 'error');

  const data = new FormData();
  data.append('access_key', WEB3FORMS_ACCESS_KEY);
  data.append('subject', 'Nueva idea para el portfolio BelloDev');
  data.append('from_name', 'Portfolio BelloDev');
  data.append('idea', IDEA_TEXT.value.trim());
  if (IDEA_EMAIL.value.trim()) data.append('email', IDEA_EMAIL.value.trim());

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const result = await res.json();
    if (result.success) {
      IDEA_STATUS.textContent = '¡Gracias! Tu idea fue enviada';
      IDEA_STATUS.classList.add('success');
      IDEA_FORM.reset();
      setTimeout(closeIdeaModal, 1800);
    } else {
      IDEA_STATUS.textContent = result.message || 'No se pudo enviar, intentá de nuevo';
      IDEA_STATUS.classList.add('error');
    }
  } catch {
    IDEA_STATUS.textContent = 'Error de conexión, intentá de nuevo';
    IDEA_STATUS.classList.add('error');
  } finally {
    IDEA_SUBMIT.disabled = false;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeIdeaModal();
});

const CONTACT_FORM = document.getElementById('contact-form');
const CONTACT_SUBMIT = CONTACT_FORM?.querySelector('button[type="submit"]');
const CONTACT_STATUS = document.getElementById('contact-status');

CONTACT_FORM?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!CONTACT_STATUS) return;

  const fd = new FormData(CONTACT_FORM);
  if (!fd.get('motivo')) {
    CONTACT_STATUS.textContent = 'Elegí un motivo';
    CONTACT_STATUS.classList.add('error');
    return;
  }
  if (!fd.get('email') || !fd.get('mensaje')) return;

  CONTACT_SUBMIT.disabled = true;
  CONTACT_STATUS.textContent = 'Enviando...';
  CONTACT_STATUS.classList.remove('success', 'error');

  const data = new FormData();
  data.append('access_key', WEB3FORMS_ACCESS_KEY);
  data.append('subject', 'Nuevo mensaje de contacto — Portfolio BelloDev');
  data.append('from_name', 'Portfolio BelloDev');
  data.append('nombre', fd.get('nombre') || '—');
  data.append('email', fd.get('email'));
  data.append('motivo', fd.get('motivo'));
  data.append('proyecto_favorito', fd.get('proyecto_favorito') || '—');
  data.append('mensaje', fd.get('mensaje'));

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const result = await res.json();
    if (result.success) {
      CONTACT_STATUS.textContent = '¡Gracias! Mensaje enviado';
      CONTACT_STATUS.classList.add('success');
      CONTACT_FORM.reset();
    } else {
      CONTACT_STATUS.textContent = result.message || 'No se pudo enviar, intentá de nuevo';
      CONTACT_STATUS.classList.add('error');
    }
  } catch {
    CONTACT_STATUS.textContent = 'Error de conexión, intentá de nuevo';
    CONTACT_STATUS.classList.add('error');
  } finally {
    CONTACT_SUBMIT.disabled = false;
  }
});

const FOOTER_YEAR = document.getElementById('footer-year');
if (FOOTER_YEAR) FOOTER_YEAR.textContent = String(new Date().getFullYear());

const FOOTER_IDEA = document.getElementById('footer-idea');
FOOTER_IDEA?.addEventListener('click', openIdeaModal);

const FOOTER_TOP = document.getElementById('footer-top');
FOOTER_TOP?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});