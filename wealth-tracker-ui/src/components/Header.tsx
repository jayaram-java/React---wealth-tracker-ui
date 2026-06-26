import './Header.css';
import { useAuth } from '../features/login/context/useAuth';
import { decodeJwtPayload } from '../utils/jwt';
import { useAppNavigation } from '../context/AppNavigationContext';

interface HeaderProps {
  onLogout?: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const { accessToken } = useAuth();
  const { currentScreen, navigateTo } = useAppNavigation();

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
  const showWebsiteLinks = isAdmin || isUser;
  const showExpenseReport = isAdmin || isUser;
  const showServiceHealth = isAdmin;
  const showMetrics = isAdmin;
  const isActive = (screen: typeof currentScreen) => currentScreen === screen;

  return (
    <header className="app-header" data-testid="app-header">
      <div className="app-header__brand">
        <span className="app-header__eyebrow">Wealth Tracker</span>
        <h2>Personal Finance Hub</h2>
      </div>
      <nav className="app-header__nav">
        {showDashboard ? (
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className={`app-header__link${isActive('dashboard') ? ' active' : ''}`}
            data-testid="nav-dashboard"
          >
            Dashboard
          </button>
        ) : null}
        <details className="app-header__dropdown">
          <summary className="app-header__link app-header__summary" data-testid="nav-manage">
            Manage
            <span className="app-header__chevron">v</span>
          </summary>
          <div className="app-header__menu">
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Expenses</span>
              {showExpenseDetails ? (
                <button
                  type="button"
                  onClick={() => navigateTo('expense-details')}
                  className={`app-header__menu-link${isActive('expense-details') ? ' active' : ''}`}
                  data-testid="nav-expenses"
                >
                  Expenses
                </button>
              ) : null}
              {showExpenseCategories ? (
                <button
                  type="button"
                  onClick={() => navigateTo('expense-categories')}
                  className={`app-header__menu-link${isActive('expense-categories') ? ' active' : ''}`}
                  data-testid="nav-expense-categories"
                >
                  Categories
                </button>
              ) : null}
            </div>
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Checklist</span>
              {showChecklists ? (
                <button
                  type="button"
                  onClick={() => navigateTo('checklists')}
                  className={`app-header__menu-link${isActive('checklists') ? ' active' : ''}`}
                  data-testid="nav-checklists"
                >
                  Checklists
                </button>
              ) : null}
              {showChecklistCategories ? (
                <button
                  type="button"
                  onClick={() => navigateTo('checklist-categories')}
                  className={`app-header__menu-link${isActive('checklist-categories') ? ' active' : ''}`}
                  data-testid="nav-checklist-categories"
                >
                  Categories
                </button>
              ) : null}
            </div>
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Resources</span>
              {showWebsiteLinks ? (
                <button
                  type="button"
                  onClick={() => navigateTo('website-links')}
                  className={`app-header__menu-link${isActive('website-links') ? ' active' : ''}`}
                  data-testid="nav-website-links"
                >
                  Links
                </button>
              ) : null}
              {showWebsiteCategories ? (
                <button
                  type="button"
                  onClick={() => navigateTo('website-categories')}
                  className={`app-header__menu-link${isActive('website-categories') ? ' active' : ''}`}
                  data-testid="nav-website-categories"
                >
                  Categories
                </button>
              ) : null}
            </div>
          </div>
        </details>
        <details className="app-header__dropdown">
          <summary className="app-header__link app-header__summary" data-testid="nav-report">
            Report
            <span className="app-header__chevron">v</span>
          </summary>
          <div className="app-header__menu">
            <div className="app-header__menu-section">
              <span className="app-header__menu-title">Expense</span>
              {showExpenseReport ? (
                <button
                  type="button"
                  onClick={() => navigateTo('expense-reports')}
                  className={`app-header__menu-link${isActive('expense-reports') ? ' active' : ''}`}
                  data-testid="nav-expense-report"
                >
                  Expense
                </button>
              ) : null}
            </div>
          </div>
        </details>
        {showServiceHealth ? (
          <button
            type="button"
            onClick={() => navigateTo('service-health')}
            className={`app-header__link${isActive('service-health') ? ' active' : ''}`}
            data-testid="nav-service-health"
          >
            Service Health
          </button>
        ) : null}
        {showMetrics ? (
          <button
            type="button"
            onClick={() => navigateTo('metrics')}
            className={`app-header__link${isActive('metrics') ? ' active' : ''}`}
            data-testid="nav-metrics"
          >
            Metrics
          </button>
        ) : null}
      </nav>
      {onLogout ? (
        <button className="ghost-button" onClick={onLogout} data-testid="logout-button">
          Sign out
        </button>
      ) : null}
    </header>
  );
};

export default Header;
