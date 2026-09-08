import './Header.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileBarChart2,
  LayoutDashboard,
  Link,
  LogOut,
  Menu,
  Receipt,
  Settings,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../features/login/context/useAuth';
import { decodeJwtPayload } from '../utils/jwt';
import { useAppNavigation } from '../context/AppNavigationContext';

interface HeaderProps {
  onLogout?: () => Promise<void> | void;
}

type DropdownKey = 'manage' | 'report' | 'user' | null;

const Header = ({ onLogout }: HeaderProps) => {
  const { accessToken, username } = useAuth();
  const { currentScreen, navigateTo } = useAppNavigation();
  const navRef = useRef<HTMLElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const userInitial = useMemo(() => {
    const value = username?.trim();
    return value ? value.charAt(0).toUpperCase() : 'U';
  }, [username]);

  const canOpenMenu = openDropdown !== null;

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;

      if (
        navRef.current &&
        userRef.current &&
        target &&
        !navRef.current.contains(target) &&
        !userRef.current.contains(target)
      ) {
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

  const handleDropdownToggle = (dropdown: Exclude<DropdownKey, null>) => {
    setOpenDropdown((currentOpen) => (currentOpen === dropdown ? null : dropdown));
  };

  const handleNavigate = (screen: Parameters<typeof navigateTo>[0]) => {
    setOpenDropdown(null);
    setDrawerOpen(false);
    navigateTo(screen);
  };

  const handleLogout = async () => {
    setOpenDropdown(null);
    setDrawerOpen(false);
    await onLogout?.();
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setDrawerOpen(false);
  };

  return (
    <header className="app-header" data-testid="app-header">
      <div className="app-header__shell">
        <button
          type="button"
          className="app-header__mobile-menu"
          onClick={() => setDrawerOpen((value) => !value)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <button type="button" className="app-header__brand" onClick={() => handleNavigate('dashboard')}>
          <span className="app-header__brand-mark" aria-hidden="true">
            💰
          </span>
          <span className="app-header__brand-text">Wealth Tracker</span>
        </button>

        <nav className="app-header__nav" ref={navRef} aria-label="Primary navigation">
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
                openDropdown === 'manage' ? ' active' : ''
              }`}
              data-testid="nav-manage"
              onClick={() => handleDropdownToggle('manage')}
              aria-expanded={openDropdown === 'manage'}
              aria-haspopup="menu"
            >
              <BriefcaseBusiness className="app-header__icon" aria-hidden="true" />
              Manage
            </button>
            {openDropdown === 'manage' ? (
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
                      Websites
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
                openDropdown === 'report' ? ' active' : ''
              }`}
              data-testid="nav-report"
              onClick={() => handleDropdownToggle('report')}
              aria-expanded={openDropdown === 'report'}
              aria-haspopup="menu"
            >
              <FileBarChart2 className="app-header__icon" aria-hidden="true" />
              Reports
            </button>
            {openDropdown === 'report' ? (
              <div className="app-header__menu" role="menu" aria-label="Reports">
                <div className="app-header__menu-section">
                  <span className="app-header__menu-title">Reporting</span>
                  {showExpenseReport ? (
                    <button
                      type="button"
                      onClick={() => handleNavigate('expense-reports')}
                      className={`app-header__menu-link${isActive('expense-reports') ? ' active' : ''}`}
                      data-testid="nav-expense-report"
                    >
                      <Receipt className="app-header__icon" aria-hidden="true" />
                      Expense Report
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

        <div className="app-header__user" ref={userRef}>
          <button
            type="button"
            className="app-header__avatar-button"
            onClick={() => setOpenDropdown((currentOpen) => (currentOpen === 'user' ? null : 'user'))}
            aria-haspopup="menu"
            aria-expanded={openDropdown === 'user'}
            aria-label="Open user menu"
          >
            <span className="app-header__avatar" aria-hidden="true">
              {userInitial}
            </span>
          </button>
          {canOpenMenu && openDropdown === 'user' ? (
            <div className="app-header__user-menu" role="menu" aria-label="User menu">
              <div className="app-header__user-profile">
                <span className="app-header__user-avatar">
                  {userInitial}
                </span>
                <div>
                  <div className="app-header__user-name">{username || 'User'}</div>
                  <div className="app-header__user-role">Account</div>
                </div>
              </div>
              <button type="button" className="app-header__menu-link" onClick={closeAll}>
                <UserCircle2 className="app-header__icon" aria-hidden="true" />
                Profile
              </button>
              <button type="button" className="app-header__menu-link" onClick={closeAll}>
                <Settings className="app-header__icon" aria-hidden="true" />
                Settings
              </button>
              {onLogout ? (
                <button type="button" className="app-header__menu-link app-header__menu-link--danger" onClick={handleLogout}>
                  <LogOut className="app-header__icon" aria-hidden="true" />
                  Logout
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <div className="app-header__drawer" role="dialog" aria-label="Navigation drawer">
          <div className="app-header__drawer-panel">
            <button type="button" className="app-header__drawer-close" onClick={closeAll} aria-label="Close navigation menu">
              ×
            </button>
            <div className="app-header__drawer-section">
              <span className="app-header__menu-title">Navigate</span>
              {showDashboard ? (
                <button type="button" className="app-header__menu-link" onClick={() => handleNavigate('dashboard')}>
                  <LayoutDashboard className="app-header__icon" aria-hidden="true" />
                  Dashboard
                </button>
              ) : null}
              {showExpenseDetails ? (
                <button type="button" className="app-header__menu-link" onClick={() => handleNavigate('expense-details')}>
                  <Receipt className="app-header__icon" aria-hidden="true" />
                  Expenses
                </button>
              ) : null}
              {showWebsiteLinks ? (
                <button type="button" className="app-header__menu-link" onClick={() => handleNavigate('website-links')}>
                  <Link className="app-header__icon" aria-hidden="true" />
                  Websites
                </button>
              ) : null}
              {showChecklists ? (
                <button type="button" className="app-header__menu-link" onClick={() => handleNavigate('checklists')}>
                  <ClipboardCheck className="app-header__icon" aria-hidden="true" />
                  Checklists
                </button>
              ) : null}
              {showExpenseReport ? (
                <button type="button" className="app-header__menu-link" onClick={() => handleNavigate('expense-reports')}>
                  <FileBarChart2 className="app-header__icon" aria-hidden="true" />
                  Reports
                </button>
              ) : null}
            </div>
            {onLogout ? (
              <button type="button" className="ghost-button" onClick={handleLogout} data-testid="logout-button">
                <LogOut className="app-header__icon" aria-hidden="true" />
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
