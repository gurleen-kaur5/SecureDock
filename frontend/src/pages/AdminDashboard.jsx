import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'user'|'task', id }
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch { setError('Failed to load stats.'); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch { setError('Failed to load users.'); }
    finally { setLoading(false); }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/tasks');
      setTasks(data.tasks);
    } catch { setError('Failed to load tasks.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'tasks') fetchTasks();
  }, [activeTab, fetchUsers, fetchTasks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'user') {
        await api.delete(`/admin/users/${deleteTarget.id}`);
        fetchUsers();
        fetchStats();
      } else {
        await api.delete(`/admin/tasks/${deleteTarget.id}`);
        fetchTasks();
        fetchStats();
      }
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed.');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-title">Admin Control Panel</div>
          <div className="page-subtitle">Manage users, tasks, and system overview</div>
        </div>

        {error && <div className="alert alert-error" onClick={() => setError('')}>{error} (click to dismiss)</div>}

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['overview', 'users', 'tasks'].map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? '⬡ Overview' : tab === 'users' ? '◈ Users' : '▣ Tasks'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value stat-accent">{stats?.totalUsers ?? '—'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Tasks</div>
                <div className="stat-value stat-warning">{stats?.totalTasks ?? '—'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Admin Accounts</div>
                <div className="stat-value stat-admin">{stats?.adminCount ?? '—'}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>System Information</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  ['API Status', '● Online'],
                  ['Authentication', 'JWT Bearer Tokens'],
                  ['Authorization', 'Role-Based Access Control (RBAC)'],
                  ['Password Hashing', 'bcrypt (12 rounds)'],
                  ['Database', 'MongoDB Atlas via Mongoose'],
                  ['Container', 'Docker + Docker Compose'],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ color: label === 'API Status' ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">All Users</div>
              <span className="badge badge-admin">{users.length} total</span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /> Loading users...</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge badge-${user.role}`}>{user.role}</span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget({ type: 'user', id: user._id })}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="empty-state"><div className="empty-text">No users found.</div></div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">All Tasks</div>
              <span className="badge badge-admin">{tasks.length} total</span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /> Loading tasks...</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task._id}>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {task.title}
                          {task.description && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                              {task.description.substring(0, 60)}{task.description.length > 60 ? '...' : ''}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: 12 }}>{task.owner?.name || 'Unknown'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.owner?.email}</div>
                        </td>
                        <td>
                          <span className={`badge badge-${task.status}`}>{task.status}</span>
                        </td>
                        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget({ type: 'task', id: task._id })}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tasks.length === 0 && (
                  <div className="empty-state"><div className="empty-text">No tasks found.</div></div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Confirm Delete</div>
            <div className="modal-text">
              {deleteTarget.type === 'user'
                ? 'This will permanently delete the user and all their tasks.'
                : 'This will permanently delete the task.'}
              {' '}This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete {deleteTarget.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
