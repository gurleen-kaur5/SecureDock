import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_OPTIONS = ['pending', 'in-progress', 'completed'];

const STATUS_NEXT = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
};

const STATUS_LABEL = {
  pending: '→ Mark In-Progress',
  'in-progress': '→ Mark Completed',
  completed: '↺ Reset to Pending',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState(null);     // task being edited
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Create ──────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '', status: 'pending' });
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Quick status cycle (one-click) ───────────────────────
  const handleQuickStatus = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}`, { status: STATUS_NEXT[task.status] });
      fetchTasks();
    } catch {
      setError('Failed to update status.');
    }
  };

  // ── Open edit modal ──────────────────────────────────────
  const openEdit = (task) => {
    setEditTask(task);
    setEditForm({ title: task.title, description: task.description || '', status: task.status });
    setFormError('');
  };

  // ── Save edit ────────────────────────────────────────────
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) { setFormError('Title is required.'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      await api.patch(`/tasks/${editTask._id}`, editForm);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update task.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/tasks/${deleteTarget}`);
      setDeleteTarget(null);
      fetchTasks();
    } catch {
      setError('Failed to delete task.');
    }
  };

  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header flex justify-between items-center">
          <div>
            <div className="page-title">My Workspace</div>
            <div className="page-subtitle">Manage your tasks, {user?.name}</div>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowCreateModal(true); setFormError(''); }}>
            + New Task
          </button>
        </div>

        {error && <div className="alert alert-error" onClick={() => setError('')}>{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value stat-accent">{counts.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value stat-warning">{counts.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: '#79c0ff' }}>{counts.inProgress}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{counts.completed}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Tasks</div>
            <span className="badge badge-user">{tasks.length} items</span>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▣</div>
              <div className="empty-text">No tasks yet. Create your first task!</div>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-item">
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                      <div className="task-desc">{task.description}</div>
                    )}
                    <div className="task-meta">
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                      <span className="text-muted" style={{ fontSize: 11 }}>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                    {/* Quick status cycle */}
                    <button
                      className="btn btn-ghost btn-sm"
                      title={STATUS_LABEL[task.status]}
                      onClick={() => handleQuickStatus(task)}
                      style={{ fontSize: 11, padding: '4px 10px' }}
                    >
                      {STATUS_LABEL[task.status]}
                    </button>

                    {/* Edit */}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(task)}
                      title="Edit task"
                    >
                      ✎
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(task._id)}
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Create New Task</div>
            <div className="modal-text">Add a task or note to your workspace.</div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Task title..."
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : '+ Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editTask && (
        <div className="modal-overlay" onClick={() => setEditTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Edit Task</div>
            <div className="modal-text">Update the title, description, or status.</div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={editForm.description}
                  onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditTask(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : '✓ Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Delete Task</div>
            <div className="modal-text">Are you sure? This action cannot be undone.</div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
