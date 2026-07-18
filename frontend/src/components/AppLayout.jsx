import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuUser,
  LuLandmark,
  LuReceipt,
  LuSparkles,
  LuRoute,
  LuFileText,
  LuUserCog,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/profile-setup', label: 'Financial Profile', icon: LuUser },
  { to: '/debts', label: 'Debt Management', icon: LuLandmark },
  { to: '/expenses', label: 'Expense Tracker', icon: LuReceipt },
  { to: '/ai-analysis', label: 'AI Analysis', icon: LuSparkles },
  { to: '/repayment-planner', label: 'Repayment Planner', icon: LuRoute },
  { to: '/reports', label: 'Reports', icon: LuFileText },
  { to: '/account', label: 'Profile', icon: LuUserCog },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          FinRelief<span className="dot">AI</span>
        </div>
        <div className="sidebar-tag">Financial Recovery</div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{user?.full_name || 'User'}</strong>
            {user?.email}
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
