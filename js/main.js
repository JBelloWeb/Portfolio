const projects = document.getElementById('projects');
const lab = document.getElementById('lab');
const education = document.getElementById('education');

const sections = [projects, lab, education];

const tags = document.querySelectorAll('.tag');


const clipObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      clipObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.9 });

sections.forEach(s => {
  const icon = s.querySelector('.clip-icon');
  if (!icon) return;

  clipObserver.observe(icon);

  icon.addEventListener('click', () => {
    sections.forEach(sec => sec.style.zIndex = '');
    s.style.zIndex = '10';
  });
});

const tagline = document.querySelector('.tagline');
if (tagline) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(tagline);
}

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

const tarjeta = document.querySelectorAll('.card-3d');

for(let t of tarjeta){
  t.addEventListener('mousemove', (e) => {
  // Obtenemos las dimensiones y la posición de la t en la pantalla
  const rect = t.getBoundingClientRect();

  // Calculamos la posición del cursor *dentro* de la t
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Encontramos el centro exacto de la t
  const centroX = rect.width / 2;
  const centroY = rect.height / 2;

  // Calculamos la rotación. 
  // Multiplicamos por 20 para definir el límite máximo de grados de rotación.
  // El eje Y controla izquierda/derecha, el eje X controla arriba/abajo.
  const rotacionX = ((y - centroY) / centroY) * -10;
  const rotacionY = ((x - centroX) / centroX) * 10;

  // Aplicamos la rotación en tiempo real
  t.style.transform = `rotateX(${rotacionX}deg) rotateY(${rotacionY}deg)`;
});

// Cuando el cursor sale de la t, la devolvemos a su estado original
t.addEventListener('mouseleave', () => {
  // Hacemos la transición más lenta para que el regreso sea suave
  t.style.transition = 'transform 0.5s ease';
  t.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// Cuando el cursor entra, restauramos la transición rápida
t.addEventListener('mouseenter', () => {
  t.style.transition = 'transform 0.1s ease-out';
});
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const mo = Math.floor(days / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(mo / 12)}y ago`;
}

const SNAPSHOT_TTL = 6 * 3600 * 1000;
const REPO_TTL = 3600 * 1000;
const COMMITS_TTL = 24 * 3600 * 1000;
const CONTRIB_TTL = 6 * 3600 * 1000;
const SNAPSHOT_FRESH_MS = 24 * 3600 * 1000;

function cacheGet(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function cacheSet(key, data, etag) {
    try {
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), etag: etag || '', data }));
    } catch {}
}

async function fetchCached(url, { ttlMs, cacheKey } = {}) {
    const key = cacheKey || `gh:${url}`;
    const cached = cacheGet(key);

    if (cached && Date.now() - cached.ts < ttlMs) return cached.data;

    let res;
    try {
        res = await fetch(url, cached?.etag ? { headers: { 'If-None-Match': cached.etag } } : undefined);
    } catch {
        return cached?.data ?? null;
    }

    if (res.status === 304) {
        if (cached) cacheSet(key, cached.data, cached.etag);
        return cached?.data ?? null;
    }
    if (!res.ok) return cached?.data ?? null;

    const data = await res.json();
    cacheSet(key, data, res.headers.get('etag') || '');
    return data;
}

let ghSnapshot = null;
let ghSnapshotReady = null;

async function loadGhSnapshot() {
    if (ghSnapshotReady) return ghSnapshotReady;
    ghSnapshotReady = (async () => {
        ghSnapshot = await fetchCached('data/github.json', { ttlMs: SNAPSHOT_TTL, cacheKey: 'gh:snapshot' });
        return ghSnapshot;
    })();
    return ghSnapshotReady;
}

async function fillGhBadges() {
    const badges = document.querySelectorAll('.gh-badge');
    const fetches = [...badges].map(async badge => {
        const repo = badge.dataset.repo;
        let data;
        try {
            data = ghSnapshot?.repos?.[repo] || await fetchCached(`https://api.github.com/repos/${repo}`, {
                ttlMs: REPO_TTL,
                cacheKey: `gh:repo:${repo}`,
            });
        } catch {
            data = null;
        }
        if (!data) return;
        badge.textContent = `🕐 ${timeAgo(data.pushed_at)}`;
        badge.title = `${data.language || 'N/A'}${data.description ? ` · ${data.description}` : ''}`;
        badge.closest('.card.project')._repoData = data;
    });
    await Promise.all(fetches);
}

async function renderGhContrib() {
    const container = document.getElementById('gh-contrib');
    if (!container) return;
    const user = container.dataset.user;

    try {
        let contributions;
        const snapContrib = ghSnapshot?.contributions;
        const snapshotFresh = ghSnapshot?.generated_at &&
            (Date.now() - new Date(ghSnapshot.generated_at).getTime()) < SNAPSHOT_FRESH_MS;
        if (Array.isArray(snapContrib) && snapContrib.length && snapshotFresh) {
            contributions = snapContrib;
        } else {
            const data = await fetchCached(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
                ttlMs: CONTRIB_TTL,
                cacheKey: 'gh:contrib',
            });
            contributions = data?.contributions;
        }
        if (!contributions || !contributions.length) return;

        const isMobile = window.innerWidth < 1024;
        const monthsRange = isMobile ? -2 : -6;
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() + monthsRange);
        contributions = contributions.filter(c => new Date(c.date) >= cutoff);
        if (!contributions.length) return;

        const map = {};
        contributions.forEach(c => { map[c.date] = c.count; });

        const first = new Date(contributions[0].date);
        const last = new Date(contributions[contributions.length - 1].date);
        const start = new Date(first);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        const totalWeeks = Math.floor((last - start) / 604800000) + 1;

        const months = {};
        for (let w = 0; w < totalWeeks; w++) {
            const mid = new Date(start.getTime() + (w * 7 + 3) * 86400000);
            const key = `${mid.getFullYear()}-${mid.getMonth()}`;
            if (!months[key]) months[key] = { l: mid.toLocaleString('en', { month: 'short' }), c: w + 2 };
        }

        const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
        const grid = document.createElement('div');
        grid.className = 'gh-grid';
        grid.style.setProperty('--weeks', totalWeeks);
        grid.style.setProperty('--cols', String(totalWeeks + 1));

        Object.values(months).forEach(m => {
            const el = document.createElement('span');
            el.className = 'gh-month-label';
            el.style.gridColumn = String(m.c);
            el.style.gridRow = '1';
            el.textContent = m.l;
            grid.appendChild(el);
        });

        for (let col = 1; col <= totalWeeks; col++) {
            for (let row = 1; row <= 7; row++) {
                const cellDate = new Date(start.getTime() + ((col - 1) * 7 + (row - 1)) * 86400000);
                const dateStr = cellDate.toISOString().split('T')[0];
                const isFuture = cellDate > new Date();

                const el = document.createElement('span');
                el.className = 'gh-day';
                el.style.gridColumn = String(col + 1);
                el.style.gridRow = String(row + 1);

                if (col === 1 && dayLabels[row - 1]) {
                    el.textContent = dayLabels[row - 1];
                    el.classList.add('gh-day-label');
                }

                if (!isFuture && map[dateStr] !== undefined) {
                    const count = map[dateStr];
                    const level = count === 0 ? 0 : Math.min(Math.ceil(count / 4) + 1, 4);
                    el.dataset.level = level;
                    el.dataset.count = count;
                    el.dataset.date = dateStr;
                } else if (!isFuture) {
                    el.dataset.level = 0;
                }

                grid.appendChild(el);
            }
        }

        container.textContent = '';
        container.appendChild(grid);

        const legend = document.createElement('div');
        legend.className = 'gh-legend';
        legend.innerHTML = 'Less <span class="gh-legend-swatches">' +
            [0,1,2,3,4].map(l => `<span data-level="${l}"></span>`).join('') +
        '</span> More';
        container.appendChild(legend);

    } catch {
        container.innerHTML = '<p class="gh-error">Failed to load contributions</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const projects = document.querySelectorAll('.card.project');
    const modal = document.getElementById('cursor-modal');
    const modalImg = modal.querySelector('.modal-img');
    const modalText = modal.querySelector('.modal-text');

    await loadGhSnapshot();
    fillGhBadges();
    renderGhContrib();

    const hideCursorModal = () => modal.classList.remove('show');
    window.addEventListener('scroll', hideCursorModal, { passive: true, capture: true });
    window.addEventListener('blur', hideCursorModal);

    projects.forEach(project => {
        let hovering = false;
        project.addEventListener('mouseenter', async () => {
            hovering = true;
            const imgSrc = project.getAttribute('data-image');
            if (imgSrc) {
                modalImg.src = imgSrc;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }

            const repo = project._repoData;
            if (repo) {
                const repoName = project.dataset.repo;

                if (!project._commitsLoaded && repoName) {
                    project._commitsLoaded = true;
                    const snapCommits = ghSnapshot?.repos?.[repoName]?.commits;
                    if (Array.isArray(snapCommits) && snapCommits.length) {
                        project._commits = snapCommits.map(c => ({
                            commit: { message: c.message, author: { date: c.date } }
                        }));
                    } else {
                        try {
                            const list = await fetchCached(`https://api.github.com/repos/${repoName}/commits?per_page=3`, {
                                ttlMs: COMMITS_TTL,
                                cacheKey: `gh:commits:${repoName}`,
                            });
                            if (Array.isArray(list) && list.length) project._commits = list;
                        } catch {}
                    }
                }

                const commits = project._commits;
                let commitsHtml = '';
                if (commits && commits.length) {
                    commitsHtml = `
                        <hr class="gh-divider">
                        ${commits.map(c => `
                            <div class="gh-commit">
                                <span class="gh-commit-msg">📝 ${c.commit.message.split('\n')[0]}</span>
                                <span class="gh-commit-date">${timeAgo(c.commit.author.date)}</span>
                            </div>
                        `).join('')}
                    `;
                }

                modalText.innerHTML = `
                    <span class="gh-stat">🔤 ${repo.language || '—'}</span>
                    <span class="gh-stat">🕐 ${timeAgo(repo.pushed_at)}</span>
                    ${commitsHtml}
                `;
                modalText.style.display = 'block';
            } else {
                modalText.style.display = 'none';
            }

            if (!hovering) return;
            modal.classList.add('show');
        });

        project.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY - 20;
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;
        });

        project.addEventListener('mouseleave', () => {
            hovering = false;
            modal.classList.remove('show');
        });
    });
});

document.querySelectorAll('.horse').forEach(horse => {
    horse.addEventListener('click', () => {
        if (horse.classList.contains('horse-react') || horse.classList.contains('horse-gallop')) return;
        horse.classList.add('horse-react');
    });

    horse.addEventListener('animationend', e => {
            if (e.animationName !== 'horse-react') return;
            horse.classList.remove('horse-react');
            horse.classList.remove('horse-idle');
            horse.classList.add('horse-gallop');
        });
});

document.querySelectorAll('.edu-card').forEach(card => {
    card.addEventListener('click', () => {
        const modal = document.getElementById('edu-modal');
        const content = modal.querySelector('.edu-modal-content');
        modal.querySelector('.edu-modal-title').textContent = card.querySelector('h3').textContent;
        modal.querySelector('.edu-modal-subtitle').textContent = card.querySelector('h4').textContent;
        modal.querySelector('.edu-modal-desc').textContent = card.querySelector('.edu-desc')?.textContent || '';
        content.classList.remove('fasta', 'davinci');
        content.classList.add(card.classList.contains('davinci') ? 'davinci' : 'fasta');
        modal.classList.add('show');
    });
});


const garabato = document.querySelectorAll('.garabato');

for(let g of garabato){
  let spans = g.querySelectorAll('span');
  for(let s of spans){
    let numeroAleatorio = Math.floor(Math.random() * 90) + 10;
    s.style.setProperty('--aleatorio', `${numeroAleatorio}px`);
  }
}

document.getElementById('edu-modal').addEventListener('click', e => {
    if (e.target.closest('.edu-modal-content') && !e.target.closest('.edu-modal-close')) return;
    e.currentTarget.classList.remove('show');
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.getElementById('edu-modal').classList.remove('show');
});
