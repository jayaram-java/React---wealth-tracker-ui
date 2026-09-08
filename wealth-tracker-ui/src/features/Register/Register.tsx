import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ROUTES } from '../../routes/routePaths';

interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: Partial<Record<'username' | 'email' | 'password' | 'confirmPassword', string>>;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSnackbarClose: () => void;
}

const Register = ({
  username,
  email,
  password,
  confirmPassword,
  isLoading,
  errorMessage,
  successMessage,
  showPassword,
  showConfirmPassword,
  errors,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
  onSnackbarClose,
}: RegisterProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4,
        background:
          'radial-gradient(circle at top left, rgba(122, 162, 255, 0.25), transparent 35%), linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(18px)',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          color: 'common.white',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.light' }}>
              Wealth Tracker
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Create your account
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              Register to start tracking your financial journey.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
                autoComplete="username"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  inputLabel: { sx: { color: 'grey.300' } },
                  input: { sx: { color: 'common.white' } },
                }}
                sx={{ '& .MuiFormHelperText-root': { color: 'error.light' } }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="email"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  inputLabel: { sx: { color: 'grey.300' } },
                  input: { sx: { color: 'common.white' } },
                }}
                sx={{ '& .MuiFormHelperText-root': { color: 'error.light' } }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
                autoComplete="new-password"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  inputLabel: { sx: { color: 'grey.300' } },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={onTogglePassword}
                          edge="end"
                          disabled={isLoading}
                          sx={{ color: 'grey.300' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { color: 'common.white' },
                  },
                }}
                sx={{ '& .MuiFormHelperText-root': { color: 'error.light' } }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  inputLabel: { sx: { color: 'grey.300' } },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                          }
                          onClick={onToggleConfirmPassword}
                          edge="end"
                          disabled={isLoading}
                          sx={{ color: 'grey.300' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { color: 'common.white' },
                  },
                }}
                sx={{ '& .MuiFormHelperText-root': { color: 'error.light' } }}
              />

              {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ mt: 3, justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              Already have an account?
            </Typography>
            <Link
              component={RouterLink}
              to={ROUTES.login}
              underline="hover"
              sx={{ fontWeight: 700 }}
            >
              Login
            </Link>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={onSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
