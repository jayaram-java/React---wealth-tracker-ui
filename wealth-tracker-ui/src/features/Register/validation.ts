export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const validateRegisterForm = (values: RegisterFormValues): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  } else if (values.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (values.username.trim().length > 30) {
    errors.username = 'Username must be 30 characters or fewer.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

