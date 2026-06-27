import './Header.css';
import { useEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileBarChart2,
  LayoutDashboard,
  Link,
  LogOut,
  Receipt,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../features/login/context/useAuth';
import { decodeJwtPayload } from '../utils/jwt';
import { useAppNavigation } from '../context/AppNavigationContext';

interface HeaderProps {
  onLogout?: () => void;
}

type DropdownKey = 'manage' | 'report';

const Header = ({ onLogout }: HeaderProps) => {
  const { accessToken } = useAuth();
  const { currentScreen, navigateTo } = useAppNavigation();
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [openDropdownPath, setOpenDropdownPath] = useState(location.pathname);

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

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;

      if (navRef.current && target && !navRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentPointerDown);
    document.addEventListener('touchstart', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
      document.removeEventListener('touchstart', handleDocumentPointerDown);
    };
  }, []);

  const handleDropdownToggle = (dropdown: DropdownKey) => {
    setOpenDropdown((currentOpen) => (currentOpen === dropdown ? null : dropdown));
    setOpenDropdownPath(location.pathname);
  };

  const handleNavigate = (screen: Parameters<typeof navigateTo>[0]) => {
    setOpenDropdown(null);
    navigateTo(screen);
  };

  return (
    <header className="app-header" data-testid="app-header">
      <div className="app-header__brand">
        <span className="app-header__eyebrow">Wealth Tracker</span>
        <h2>Personal Finance Hub</h2>
      </div>
      <nav className="app-header__nav" ref={navRef}>
        {showDashboard ? (
          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            className={`app-header__link${isActive('dashboard') ? ' active' : ''}`}
            data-testid="nav-dashboard"
          >
            <LayoutDashboard className="app-header__icon" aria-hidden="true" />
            Dashboard
          </button>
        ) : null}
        <div className="app-header__dropdown">
          <button
            type="button"
            className={`app-header__link app-header__summary${
              openDropdown === 'manage' && openDropdownPath === location.pathname ? ' active' : ''
            }`}
            data-testid="nav-manage"
            onClick={() => handleDropdownToggle('manage')}
            aria-expanded={openDropdown === 'manage' && openDropdownPath === location.pathname}
            aria-haspopup="menu"
          >
            <BriefcaseBusiness className="app-header__icon" aria-hidden="true" />
            Manage
            <span className="app-header__chevron">v</span>
          </button>
          {openDropdown === 'manage' && openDropdownPath === location.pathname ? (
            <div className="app-header__menu" role="menu" aria-label="Manage">
              <div className="app-header__menu-section">
                <span className="app-header__menu-title">Expenses</span>
                {showExpenseDetails ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('expense-details')}
                    className={`app-header__menu-link${isActive('expense-details') ? ' active' : ''}`}
                    data-testid="nav-expenses"
                  >
                    <Receipt className="app-header__icon" aria-hidden="true" />
                    Expenses
                  </button>
                ) : null}
                {showExpenseCategories ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('expense-categories')}
                    className={`app-header__menu-link${isActive('expense-categories') ? ' active' : ''}`}
                    data-testid="nav-expense-categories"
                  >
                    <Receipt className="app-header__icon" aria-hidden="true" />
                    Categories
                  </button>
                ) : null}
              </div>
              <div className="app-header__menu-section">
                <span className="app-header__menu-title">Checklist</span>
                {showChecklists ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('checklists')}
                    className={`app-header__menu-link${isActive('checklists') ? ' active' : ''}`}
                    data-testid="nav-checklists"
                  >
                    <ClipboardCheck className="app-header__icon" aria-hidden="true" />
                    Checklists
                  </button>
                ) : null}
                {showChecklistCategories ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('checklist-categories')}
                    className={`app-header__menu-link${isActive('checklist-categories') ? ' active' : ''}`}
                    data-testid="nav-checklist-categories"
                  >
                    <ClipboardCheck className="app-header__icon" aria-hidden="true" />
                    Categories
                  </button>
                ) : null}
              </div>
              <div className="app-header__menu-section">
                <span className="app-header__menu-title">Resources</span>
                {showWebsiteLinks ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('website-links')}
                    className={`app-header__menu-link${isActive('website-links') ? ' active' : ''}`}
                    data-testid="nav-website-links"
                  >
                    <Link className="app-header__icon" aria-hidden="true" />
                    Links
                  </button>
                ) : null}
                {showWebsiteCategories ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('website-categories')}
                    className={`app-header__menu-link${isActive('website-categories') ? ' active' : ''}`}
                    data-testid="nav-website-categories"
                  >
                    <Link className="app-header__icon" aria-hidden="true" />
                    Categories
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <div className="app-header__dropdown">
          <button
            type="button"
            className={`app-header__link app-header__summary${
              openDropdown === 'report' && openDropdownPath === location.pathname ? ' active' : ''
            }`}
            data-testid="nav-report"
            onClick={() => handleDropdownToggle('report')}
            aria-expanded={openDropdown === 'report' && openDropdownPath === location.pathname}
            aria-haspopup="menu"
          >
            <FileBarChart2 className="app-header__icon" aria-hidden="true" />
            Report
            <span className="app-header__chevron">v</span>
          </button>
          {openDropdown === 'report' && openDropdownPath === location.pathname ? (
            <div className="app-header__menu" role="menu" aria-label="Report">
              <div className="app-header__menu-section">
                <span className="app-header__menu-title">Expense</span>
                {showExpenseReport ? (
                  <button
                    type="button"
                    onClick={() => handleNavigate('expense-reports')}
                    className={`app-header__menu-link${isActive('expense-reports') ? ' active' : ''}`}
                    data-testid="nav-expense-report"
                  >
                    <Receipt className="app-header__icon" aria-hidden="true" />
                    Expense
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        {showServiceHealth ? (
          <button
            type="button"
            onClick={() => handleNavigate('service-health')}
            className={`app-header__link${isActive('service-health') ? ' active' : ''}`}
            data-testid="nav-service-health"
          >
            Service Health
          </button>
        ) : null}
        {showMetrics ? (
          <button
            type="button"
            onClick={() => handleNavigate('metrics')}
            className={`app-header__link${isActive('metrics') ? ' active' : ''}`}
            data-testid="nav-metrics"
          >
            Metrics
          </button>
        ) : null}
      </nav>
      {onLogout ? (
        <button className="ghost-button" onClick={onLogout} data-testid="logout-button">
          <LogOut className="app-header__icon" aria-hidden="true" />
          Sign out
        </button>
      ) : null}
    </header>
  );
};

export default Header;
