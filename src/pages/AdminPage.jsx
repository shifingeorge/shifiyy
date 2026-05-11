import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getToken, setToken, clearToken,
  verifyToken, getProjects, addProject, removeProject,
} from '../lib/github';
import './AdminPage.css';

export default function AdminPage() {
  const [tokenInput, setTokenInput] = useState(getToken());
  const [connected, setConnected] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [form, setForm] = useState({ name: '', description: '', url: '' });
  const [image, setImage] = useState(null); // { preview, base64, ext }
  const [draggingOver, setDraggingOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fileRef = useRef(null);

  // Auto-connect if token already saved
  useEffect(() => {
    if (getToken()) autoConnect();
  }, []); // eslint-disable-line

  async function autoConnect() {
    try {
      await verifyToken();
      setConnected(true);
      loadProjects();
    } catch {
      clearToken();
    }
  }

  async function handleConnect() {
    if (!tokenInput.trim()) return;
    setVerifying(true);
    try {
      setToken(tokenInput.trim());
      await verifyToken();
      setConnected(true);
      showToast('success', '✓ Connected to GitHub');
      loadProjects();
    } catch (e) {
      clearToken();
      showToast('error', 'Invalid token or no push access to this repo.');
    } finally {
      setVerifying(false);
    }
  }

  function handleDisconnect() {
    clearToken();
    setTokenInput('');
    setConnected(false);
    setProjects([]);
  }

  async function loadProjects() {
    setLoadingProjects(true);
    try {
      const { projects: data } = await getProjects();
      setProjects([...data].reverse());
    } catch (e) {
      showToast('error', 'Could not load projects: ' + e.message);
    } finally {
      setLoadingProjects(false);
    }
  }

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file.');
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target.result;
      setImage({ preview: result, base64: result.split(',')[1], ext });
    };
    reader.readAsDataURL(file);
  }, []);

  function handleDrop(e) {
    e.preventDefault();
    setDraggingOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return showToast('error', 'Please select an image first.');
    if (!form.name.trim()) return showToast('error', 'Project name is required.');
    setSubmitting(true);
    try {
      const entry = await addProject({
        name: form.name.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
        imageBase64: image.base64,
        imageExt: image.ext,
      });
      setProjects(prev => [entry, ...prev]);
      setForm({ name: '', description: '', url: '' });
      setImage(null);
      showToast('success', `"${entry.name}" published!`);
    } catch (e) {
      showToast('error', 'Failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(project) {
    if (!confirm(`Remove "${project.name}" from your portfolio?`)) return;
    setDeletingId(project.id);
    try {
      await removeProject(project);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      showToast('success', `"${project.name}" removed.`);
    } catch (e) {
      showToast('error', 'Delete failed: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  }

  return (
    <div className="ap-root">
      {/* Header */}
      <header className="ap-header">
        <div className="ap-logo">
          shifiyy <span className="ap-logo-tag">/admin</span>
        </div>
        <a href="/" className="ap-back-link">← View Portfolio</a>
      </header>

      {/* Token bar */}
      <div className={`ap-token-bar ${connected ? 'is-connected' : ''}`}>
        <span className="ap-token-icon">{connected ? '🟢' : '🔑'}</span>
        {connected ? (
          <>
            <span className="ap-token-status">Connected to <strong>shifingeorge/shifiyy</strong></span>
            <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={handleDisconnect}>
              Disconnect
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              className="ap-token-input"
              placeholder="Paste your GitHub Personal Access Token…"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConnect()}
              autoFocus
            />
            <button
              className="ap-btn ap-btn-primary ap-btn-sm"
              onClick={handleConnect}
              disabled={verifying || !tokenInput.trim()}
            >
              {verifying ? 'Connecting…' : 'Connect'}
            </button>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="ap-content">

        {/* ── Add project form ── */}
        <section className="ap-panel">
          <h2 className="ap-panel-title">Add Project</h2>
          <form className="ap-form" onSubmit={handleSubmit}>

            {/* Image drop zone */}
            <div
              className={`ap-drop-zone ${draggingOver ? 'is-over' : ''} ${image ? 'has-image' : ''}`}
              onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
              onDragLeave={() => setDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              {image ? (
                <>
                  <img src={image.preview} alt="preview" className="ap-drop-preview" />
                  <div className="ap-drop-change">Click to change</div>
                </>
              ) : (
                <div className="ap-drop-placeholder">
                  <span className="ap-drop-icon">↑</span>
                  <span className="ap-drop-text">Drop image or click to browse</span>
                  <span className="ap-drop-hint">JPG · PNG · WEBP</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => processFile(e.target.files[0])}
              />
            </div>

            <div className="ap-field">
              <label className="ap-label">Name *</label>
              <input
                className="ap-input"
                type="text"
                placeholder="My Awesome Project"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="ap-field">
              <label className="ap-label">Description</label>
              <textarea
                className="ap-input ap-textarea"
                placeholder="A short description shown when the image is opened…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="ap-field">
              <label className="ap-label">Website URL <span className="ap-label-opt">(optional)</span></label>
              <input
                className="ap-input"
                type="url"
                placeholder="https://myproject.com"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              className="ap-btn ap-btn-primary ap-btn-full"
              disabled={submitting || !connected || !image || !form.name.trim()}
            >
              {submitting ? (
                <><span className="ap-spinner" /> Publishing to GitHub…</>
              ) : (
                'Publish Project'
              )}
            </button>
            {!connected && (
              <p className="ap-form-hint">Connect your GitHub token above to publish.</p>
            )}
          </form>
        </section>

        {/* ── Projects list ── */}
        <section className="ap-panel ap-panel-projects">
          <div className="ap-panel-header">
            <h2 className="ap-panel-title">
              Published <span className="ap-count">{projects.length}</span>
            </h2>
            <button
              className="ap-btn ap-btn-ghost ap-btn-sm"
              onClick={loadProjects}
              disabled={loadingProjects || !connected}
            >
              {loadingProjects ? '…' : '↻ Refresh'}
            </button>
          </div>

          {!connected ? (
            <div className="ap-empty">Connect your token to see projects.</div>
          ) : loadingProjects ? (
            <div className="ap-empty">
              <span className="ap-spinner" /> Loading…
            </div>
          ) : projects.length === 0 ? (
            <div className="ap-empty">
              <span className="ap-empty-icon">🌐</span>
              <p>No projects published yet.</p>
              <p className="ap-empty-sub">Add your first one using the form.</p>
            </div>
          ) : (
            <div className="ap-projects-grid">
              {projects.map(p => (
                <div key={p.id} className="ap-project-card">
                  <div className="ap-card-thumb">
                    <img src={p.src} alt={p.alt} />
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ap-card-visit"
                        title="Visit website"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <div className="ap-card-info">
                    <strong className="ap-card-name">{p.name}</strong>
                    {p.description && (
                      <p className="ap-card-desc">{p.description}</p>
                    )}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="ap-card-url">
                        {p.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  <button
                    className="ap-card-delete"
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    title="Remove project"
                  >
                    {deletingId === p.id ? '…' : '✕'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`ap-toast ap-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
