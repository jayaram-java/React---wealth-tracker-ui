import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import '../styles/Login.css';
import { ROUTES } from '../../../routes/routePaths';

interface LoginPresenterProps {
  username: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
  registerPath: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginPresenter = ({
  username,
  password,
  isLoading,
  errorMessage,
  registerPath,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginPresenterProps) => {
  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-hero">
        <div className="login-hero__brand">Wealth Tracker</div>
        <h1>Take control of every rupee.</h1>
        <p>
          Track spending, set goals, and see your money story unfold in one
          beautiful dashboard.
        </p>
        <div className="login-hero__stats">
          <div>
            <span>48%</span>
            <small>More clarity</small>
          </div>
          <div>
            <span>12+</span>
            <small>Smart insights</small>
          </div>
          <div>
            <span>24/7</span>
            <small>Access anywhere</small>
          </div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-card__badge">Secure Login</div>
        <h2>Welcome back</h2>
        <p className="login-card__subtitle">
          Sign in with your Wealth Tracker credentials.
        </p>

        <form className="login-form" onSubmit={onSubmit} data-testid="login-form">
          <label>
            Username
            <input
              type="text"
              data-testid="login-username"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              placeholder="jram.user"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              data-testid="login-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Password@123"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? (
            <div className="login-form__error" role="alert" data-testid="login-error">
              {errorMessage}
            </div>
          ) : null}

          <button type="submit" disabled={isLoading} data-testid="login-submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-card__footer">
          <span>Don&apos;t have an account?</span>
          <Link component={RouterLink} to={registerPath ?? ROUTES.register} underline="hover">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPresenter;
