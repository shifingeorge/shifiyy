const REPO = 'shifingeorge/shifiyy';
const BRANCH = 'main';
const API = 'https://api.github.com';

// Token: env var (baked at build time) → localStorage fallback
const ENV_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
export const getToken = () => ENV_TOKEN || localStorage.getItem('shifiyy_gh_token') || '';
export const hasEnvToken = () => !!ENV_TOKEN;
export const setToken = t => localStorage.setItem('shifiyy_gh_token', t);
export const clearToken = () => localStorage.removeItem('shifiyy_gh_token');

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function ghFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub error ${res.status}`);
  }
  return res.json();
}

async function getFile(path) {
  try {
    return await ghFetch(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  } catch (e) {
    if (e.message.includes('Not Found') || e.message.includes('404')) return null;
    throw e;
  }
}

async function putFile(path, base64Content, message, sha) {
  const body = { message, content: base64Content, branch: BRANCH };
  if (sha) body.sha = sha;
  return ghFetch(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function deleteFile(path, message, sha) {
  return ghFetch(`/repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

export async function verifyToken() {
  const data = await ghFetch(`/repos/${REPO}`);
  if (!data.permissions?.push) throw new Error('No push access');
  return true;
}

export async function getProjects() {
  const file = await getFile('public/projects.json');
  if (!file) return { projects: [], sha: null };
  const raw = file.content.replace(/\s/g, '');
  const text = new TextDecoder().decode(
    Uint8Array.from(atob(raw), c => c.charCodeAt(0))
  );
  return { projects: JSON.parse(text), sha: file.sha };
}

export async function addProject({ name, description, url, imageBase64, imageExt }) {
  const slug = `${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const imagePath = `public/projects/images/${slug}.${imageExt}`;

  // 1. Upload image
  await putFile(imagePath, imageBase64, `feat: add image for "${name}"`);

  // 2. Append to projects.json
  const { projects, sha } = await getProjects();
  const entry = {
    id: slug,
    src: `/projects/images/${slug}.${imageExt}`,
    alt: name,
    name,
    description,
    ...(url ? { url } : {}),
    createdAt: new Date().toISOString(),
  };
  projects.push(entry);
  await putFile(
    'public/projects.json',
    textToBase64(JSON.stringify(projects, null, 2)),
    `feat: add project "${name}"`,
    sha
  );
  return entry;
}

export async function removeProject(project) {
  // 1. Delete image if stored in repo
  if (project.src?.startsWith('/projects/images/')) {
    const imgPath = `public${project.src}`;
    const imgFile = await getFile(imgPath);
    if (imgFile) {
      await deleteFile(imgPath, `chore: remove image for "${project.name}"`, imgFile.sha);
    }
  }
  // 2. Remove from projects.json
  const { projects, sha } = await getProjects();
  const updated = projects.filter(p => p.id !== project.id);
  await putFile(
    'public/projects.json',
    textToBase64(JSON.stringify(updated, null, 2)),
    `feat: remove project "${project.name}"`,
    sha
  );
}
