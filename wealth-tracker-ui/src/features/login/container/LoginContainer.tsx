import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import LoginPresenter from '../presenter/LoginPresenter';
import type { LoginRequest, LoginResponse } from '../types/LoginTypes';
import { useAuth } from '../context/useAuth';

const LoginContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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
      const state = location.state as { from?: { pathname?: string; search?: string } } | null;
      const nextPath = state?.from?.pathname
        ? `${state.from.pathname}${state.from.search ?? ''}`
        : '/dashboard';
      navigate(nextPath, { replace: true });
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
