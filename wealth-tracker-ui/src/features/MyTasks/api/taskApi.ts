import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type {
  EmployeeTask,
  TaskCreatePayload,
  TaskUpdatePayload,
} from '../types/MyTasksTypes';

const authHeader = (
  accessToken: string,
  tokenType: string
): Record<string, string> => ({
  Authorization: `${tokenType || 'Bearer'} ${accessToken}`,
});

export const getAllTasks = (
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask[]> =>
  getRequest<EmployeeTask[]>(API_ENDPOINTS.tasks.base, {
    headers: authHeader(accessToken, tokenType),
    skipLoader: true,
  });

export const getTaskById = (
  id: number,
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask> =>
  getRequest<EmployeeTask>(API_ENDPOINTS.tasks.byId(id), {
    headers: authHeader(accessToken, tokenType),
    skipLoader: true,
  });

export const getTasksByEmployee = (
  employeeId: number,
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask[]> =>
  getRequest<EmployeeTask[]>(API_ENDPOINTS.tasks.byEmployee(employeeId), {
    headers: authHeader(accessToken, tokenType),
    skipLoader: true,
  });

export const getTasksByStatus = (
  status: string,
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask[]> =>
  getRequest<EmployeeTask[]>(API_ENDPOINTS.tasks.byStatus(status), {
    headers: authHeader(accessToken, tokenType),
    skipLoader: true,
  });

export const createTask = (
  payload: TaskCreatePayload,
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask> =>
  postRequest<EmployeeTask, TaskCreatePayload>(API_ENDPOINTS.tasks.base, payload, {
    headers: authHeader(accessToken, tokenType),
  });

export const updateTask = (
  id: number,
  payload: TaskUpdatePayload,
  accessToken: string,
  tokenType: string
): Promise<EmployeeTask> =>
  putRequest<EmployeeTask, TaskUpdatePayload>(
    API_ENDPOINTS.tasks.byId(id),
    payload,
    { headers: authHeader(accessToken, tokenType) }
  );

export const deleteTask = (
  id: number,
  accessToken: string,
  tokenType: string
): Promise<void> =>
  deleteRequest<void>(API_ENDPOINTS.tasks.byId(id), {
    headers: authHeader(accessToken, tokenType),
  });
