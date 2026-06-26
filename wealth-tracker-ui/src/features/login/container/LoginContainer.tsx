import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { postRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import LoginPresenter from '../presenter/LoginPresenter';
import type { LoginRequest, LoginResponse } from '../types/LoginTypes';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../../../routes/routePaths';

const LoginContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: LoginRequest = { username, password };
      const response = await postRequest<LoginResponse, LoginRequest>(
        API_ENDPOINTS.auth.login,
        payload
      );

      login(response, username);
      const from = (location.state as { from?: Location } | null)?.from?.pathname;
      navigate(from ?? ROUTES.dashboard, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to login. Try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPresenter
      username={username}
      password={password}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;
