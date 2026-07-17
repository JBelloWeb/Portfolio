const projects = document.getElementById('projects');
const lab = document.getElementById('lab');
const education = document.getElementById('education');

const sections = [projects, lab, education];

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