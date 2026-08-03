const REPOS = [
    'JBelloWeb/prode-mundial-254',
    'JBelloWeb/Goat-Market',
    'JBelloWeb/moviefy',
    'JBelloWeb/Formula1API',
];

const USER = 'JBelloWeb';
const GITHUB = 'https://api.github.com/repos';
const CONTRIB_URL = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;

const headers = process.env.GH_TOKEN
    ? { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json' }
    : { Accept: 'application/vnd.github+json' };

async function gh(path) {
    const res = await fetch(`${GITHUB}/${path}`, { headers });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return res.json();
}

const repos = {};
for (const repo of REPOS) {
    try {
        const data = await gh(repo);
        let commits = [];
        try {
            const list = await gh(`${repo}/commits?per_page=3`);
            commits = list.map(c => ({
                message: c.commit.message,
                date: c.commit.author?.date || c.commit.committer?.date || '',
                author: c.commit.author?.name || c.commit.committer?.name || '',
                url: c.html_url || '',
            }));
        } catch {}
        repos[repo] = {
            pushed_at: data.pushed_at || '',
            language: data.language || null,
            description: data.description || null,
            html_url: data.html_url || `https://github.com/${repo}`,
            commits,
        };
    } catch {
        repos[repo] = {
            pushed_at: '',
            language: null,
            description: null,
            html_url: `https://github.com/${repo}`,
            commits: [],
        };
    }
}

let contributions = [];
try {
    const res = await fetch(CONTRIB_URL);
    if (res.ok) {
        const body = await res.json();
        contributions = (body.contributions || []).map(c => ({ date: c.date, count: c.count }));
    }
} catch {}

const out = { generated_at: new Date().toISOString(), repos, contributions };

const fs = await import('node:fs');
const path = await import('node:path');
const file = path.join(process.cwd(), 'data', 'github.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`Written ${file} (${Object.keys(repos).length} repos, ${contributions.length} contribution days)`);
