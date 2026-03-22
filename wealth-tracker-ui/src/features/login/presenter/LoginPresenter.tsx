import '../styles/Login.css';

interface LoginPresenterProps {
  username: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginPresenter = ({
  username,
  password,
  isLoading,
  errorMessage,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginPresenterProps) => {
  return (
    <div className="login-page">
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

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            Username
            <input
              type="text"
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
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Password@123"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? (
            <div className="login-form__error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-card__footer">
          <span>Need help?</span>
          <span>Contact your administrator.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPresenter;
