import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import { postRequest } from '../../../serviceconfigs/AxiosAPI';

export const logoutRequest = async (refreshToken: string) => {
  if (!refreshToken) {
    return;
  }

  await postRequest<void, Record<string, never>>(API_ENDPOINTS.auth.logout, {}, {
    headers: {
      'X-Refresh-Token': refreshToken,
    },
  });
};
