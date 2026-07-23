const projects = document.getElementById('projects');
const lab = document.getElementById('lab');
const education = document.getElementById('education');

const sections = [projects, lab, education];

const tags = document.querySelectorAll('.tag');


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.3 });

sections.forEach(s => {
  const icon = s.querySelector('.clip-icon');
  if (!icon) return;

  observer.observe(icon);

  icon.addEventListener('click', () => {
    sections.forEach(sec => sec.style.zIndex = '');
    s.style.zIndex = '10';
  });
});

for(let t of tags){
  switch(t.textContent){
    case 'HTML':
      t.style = "--tech-color: #E34F2640";
      break;

    case 'CSS':
      t.style = "--tech-color: #1573b640";
      break;

    case 'JavaScript':
      t.style = "--tech-color: #F7DF1E40";
      break;

    case 'Vue':
      t.style = "--tech-color: #4FC08D40";
      break;
      
    case 'PHP':
      t.style = "--tech-color: #777BB440";
      break;

    case 'Supabase':
      t.style = "--tech-color: #3ECF8E40";
      break;

    case 'Git':
      t.style = "--tech-color: #F0503240";      
      break;

    case 'Figma':
      t.style = "--tech-color: #A259FF40";      
      break;

    case 'Frontend':
      t.style = "--tech-color: #00d2ff40";      
      break;

    case 'Backend':
      t.style = "--tech-color: #7a5ddd40";      
      break;

    case 'Vanilla':
      t.style = "--tech-color: #f3e5ab40";      
      break;

    case 'SQL':
      t.style="--tech-color:#00758F40"
      break;

    case 'MySQL':
      t.style="--tech-color:#00758F40"
      break;

    case 'PWA':
      t.style="--tech-color:#5A0FC840"
      break;

    case 'API':
      t.style="--tech-color:#00B4D840"
      break;

    case 'Vuetify':
      t.style="--tech-color:#1867C040"
      break;

    case 'SVG':
      t.style="--tech-color:#FFB13B40"
      break;

    default:
      break;
  }
}