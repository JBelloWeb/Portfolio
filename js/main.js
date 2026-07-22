const projects = document.getElementById('projects');
const lab = document.getElementById('lab');
const education = document.getElementById('education');

const sections = [projects, lab, education];

const tags = document.querySelectorAll('.tags');

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
  let tag = t.querySelectorAll('span');

  for(let i of tag){
    i.style = "border-radius: 25px; background-color: red; padding: 0.3rem; min-width: 100px;"
  }
}