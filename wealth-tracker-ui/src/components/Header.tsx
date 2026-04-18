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
  const showChecklistCategories = isAdmin;
  const showChecklists = isAdmin || isUser;
  const showWebsiteCategories = isAdmin;
  const showWebsiteLinks = isAdmin;
  const showExpenseReport = isAdmin || isUser;

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
        <details className="app-header__dropdown">
          <summary className="app-header__link app-header__summary">
            Manage
            <span className="app-header__chevron">v</span>
          </summary>
          <div className="app-header__menu">
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Expenses</span>
              {showExpenseDetails ? (
                <NavLink
                  to="/expense-details"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Expenses
                </NavLink>
              ) : null}
              {showExpenseCategories ? (
                <NavLink
                  to="/expense-categories"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Categories
                </NavLink>
              ) : null}
            </div>
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Checklist</span>
              {showChecklists ? (
                <NavLink
                  to="/checklists"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Checklists
                </NavLink>
              ) : null}
              {showChecklistCategories ? (
                <NavLink
                  to="/checklist-categories"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Categories
                </NavLink>
              ) : null}
            </div>
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Resources</span>
              {showWebsiteLinks ? (
                <NavLink
                  to="/website-links"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Links
                </NavLink>
              ) : null}
              {showWebsiteCategories ? (
                <NavLink
                  to="/website-categories"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Categories
                </NavLink>
              ) : null}
            </div>
          </div>
        </details>
        <details className="app-header__dropdown">
          <summary className="app-header__link app-header__summary">
            Report
            <span className="app-header__chevron">v</span>
          </summary>
          <div className="app-header__menu">
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Expense</span>
              {showExpenseReport ? (
                <NavLink
                  to="/expense-reports"
                  className={({ isActive }) =>
                    `app-header__menu-link${isActive ? ' active' : ''}`
                  }
                >
                  Expense
                </NavLink>
              ) : null}
            </div>
          </div>
        </details>
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
