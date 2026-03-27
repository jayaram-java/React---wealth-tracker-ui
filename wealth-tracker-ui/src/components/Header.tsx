import { NavLink } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../features/login/context/AuthProvider';
import { decodeJwtPayload } from '../utils/jwt';

interface HeaderProps {
  onLogout?: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const { accessToken } = useAuth();

  const payload = accessToken
    ? decodeJwtPayload<{ roles?: string[] }>(accessToken)
    : null;
  const roles = payload?.roles ?? [];
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isUser = roles.includes('ROLE_USER');

  const showDashboard = isAdmin || isUser || roles.length === 0;
  const showExpenseDetails = isAdmin || isUser;
  const showExpenseCategories = isAdmin;
  const showWebsiteCategories = isAdmin;
  const showWebsiteLinks = isAdmin;

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__eyebrow">Wealth Tracker</span>
        <h2>Personal Finance Hub</h2>
      </div>
      <nav className="app-header__nav">
        {showDashboard ? (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' active' : ''}`
            }
          >
            Dashboard
          </NavLink>
        ) : null}
        {showExpenseCategories ? (
          <NavLink
            to="/expense-categories"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' active' : ''}`
            }
          >
            Expense Categories
          </NavLink>
        ) : null}
        {showExpenseDetails ? (
          <NavLink
            to="/expense-details"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' active' : ''}`
            }
          >
            Expense Details
          </NavLink>
        ) : null}
        {showWebsiteCategories ? (
          <NavLink
            to="/website-categories"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' active' : ''}`
            }
          >
            Website Categories
          </NavLink>
        ) : null}
        {showWebsiteLinks ? (
          <NavLink
            to="/website-links"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' active' : ''}`
            }
          >
            Website Links
          </NavLink>
        ) : null}
      </nav>
      {onLogout ? (
        <button className="ghost-button" onClick={onLogout}>
          Sign out
        </button>
      ) : null}
    </header>
  );
};

export default Header;
