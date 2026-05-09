import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'admin'
    ? [
        { icon: '⬡', label: 'Overview', path: '/admin', tab: 'overview' },
        { icon: '◈', label: 'Users', path: '/admin', tab: 'users' },
        { icon: '▣', label: 'All Tasks', path: '/admin', tab: 'tasks' },
      ]
    : [
        { icon: '◫', label: 'My Tasks', path: '/dashboard' },
      ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">SecureDock</div>
        <div className="logo-sub">RBAC System</div>
      </div>

      <div className="sidebar-user">
        <div className="user-name">{user?.name}</div>
        <span className={`user-role ${user?.role}`}>
          {user?.role === 'admin' ? '⬡ Admin' : '◈ User'}
        </span>
        <div className="text-sm text-muted mt-1" style={{ fontSize: 11 }}>{user?.email}</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <span>⎋</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
