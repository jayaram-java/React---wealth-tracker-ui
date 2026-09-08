import { API_ENDPOINTS } from '../../serviceconfigs/ApiEndpoints';
import { postRequest } from '../../serviceconfigs/AxiosAPI';
import type { RegisterRequest, RegisterResponse } from './RegisterModel';

export const registerRequest = async (payload: RegisterRequest) => {
  return postRequest<RegisterResponse, RegisterRequest>(
    API_ENDPOINTS.auth.register,
    payload
  );
};

