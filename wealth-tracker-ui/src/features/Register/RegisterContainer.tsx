import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/context/useAuth';
import { ROUTES } from '../../routes/routePaths';
import Register from './Register';
import type { RegisterRequest } from './RegisterModel';
import { registerRequest } from './RegisterService';
import { validateRegisterForm, type RegisterFormErrors } from './validation';

const RegisterContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const redirectTimerRef = useRef<number | null>(null);

  const runValidation = () => {
    const nextErrors = validateRegisterForm({
      username,
      email,
      password,
      confirmPassword,
    });
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = runValidation();

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: RegisterRequest = {
        username: username.trim(),
        email: email.trim(),
        password,
      };
      const response = await registerRequest(payload);

      login(response, payload.username);
      setSuccessMessage('Registration successful.');
      redirectTimerRef.current = window.setTimeout(() => {
        navigate(ROUTES.dashboard, { replace: true });
      }, 900);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to register. Try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  return (
    <Register
      username={username}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      isLoading={isLoading}
      errorMessage={errorMessage}
      successMessage={successMessage}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      errors={errors}
      onUsernameChange={setUsername}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onTogglePassword={() => setShowPassword((current) => !current)}
      onToggleConfirmPassword={() => setShowConfirmPassword((current) => !current)}
      onSubmit={handleSubmit}
      onSnackbarClose={() => setSuccessMessage(null)}
    />
  );
};

export default RegisterContainer;
