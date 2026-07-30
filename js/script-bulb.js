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

document.documentElement.classList.add('off');

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

  set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
  set(document.documentElement, {'--mode': STATE.ON ? "var(--bello-cream)" :"var(--bello-black)"});
  set(document.documentElement, {'--section-bg': STATE.ON ? "var(--bello-black)" :"#9c2430"});
  set(document.documentElement, {'--h3-color': STATE.ON ? "var(--bello-red)" : "var(--bello-cream)"});
  set(document.documentElement, {'--clip-color': STATE.ON ? "var(--bello-red)" : "var(--bello-cream)"});
  set(document.documentElement, {'--section-text': STATE.ON ? "var(--bello-cream)" : "var(--bello-cream)"});
  set(document.documentElement, {'--text-color': STATE.ON ? "var(--bello-black)" : "var(--bello-cream)"});
  set(document.documentElement, {'--title-color': STATE.ON ? "var(--bello-purple)" : "var(--bello-cream)"});
  set(document.documentElement, {'--hr-color': STATE.ON ? "var(--bello-purple)" : "var(--bello-black)"});
  // set(document.documentElement, {'--cord': STATE.ON ? "#d72638" : "#fff2c7"});
  document.documentElement.classList.toggle('off', !STATE.ON);

  set(document.documentElement, {'--modal-bg': STATE.ON ? "var(--bello-black)" : "var(--bello-cream)"});
  set(document.documentElement, {'--modal-text': STATE.ON ? "var(--bello-cream)" : "var(--bello-black)"});
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

WELCOME.classList.add('grow');