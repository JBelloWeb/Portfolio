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

const STATE = {
  ON: false };

const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');
const WELCOME = document.getElementById('welcome');
const WHOAMI_P = document.querySelectorAll('#whoami p');
const MID = document.querySelector('.mid-bar');
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
  STATE.ON = !STATE.ON;
  WELCOME.className = STATE.ON ? 'grow' : 'ungrow';
  for (let p of WHOAMI_P) { STATE.ON ? p.classList.remove('d-none') : p.classList.add('d-none'); }
  STATE.ON ? MID.classList.add('d-none') : MID.classList.remove('d-none');
  STATE.ON ? MAIN.classList.remove('d-none') : MAIN.classList.add('d-none');
  STATE.ON ? CONTACT.classList.remove('d-none') : CONTACT.classList.add('d-none');
  for(let a of air){STATE.ON ? a.classList.remove('d-none') : a.classList.add('d-none');};

  set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
  set(document.documentElement, {'--mode': STATE.ON ? "var(--bello-cream)" :"var(--bello-black)"});
  set(DUMMY, { display: 'none' });
  set(CORDS[0], { display: 'inline' });
  AUDIO.CLICK.play();
};

const onComplete = () => {
  set(DUMMY, { display: 'block' });
  set(CORDS[0], { display: 'none' });
  RESET();
  IS_PLAYING = false;
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

