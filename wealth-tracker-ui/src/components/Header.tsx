import { NavLink } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onLogout?: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__eyebrow">Wealth Tracker</span>
        <h2>Personal Finance Hub</h2>
      </div>
      <nav className="app-header__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `app-header__link${isActive ? ' active' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/expense-categories"
          className={({ isActive }) =>
            `app-header__link${isActive ? ' active' : ''}`
          }
        >
          Expense Categories
        </NavLink>
        <NavLink
          to="/expense-details"
          className={({ isActive }) =>
            `app-header__link${isActive ? ' active' : ''}`
          }
        >
          Expense Details
        </NavLink>
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
