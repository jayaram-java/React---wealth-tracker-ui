interface ApiError extends Error {
  status?: number;
}

interface ApiRequestOptions {
  headers?: Record<string, string>;
}

const buildError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
};

const parseResponse = async <TResponse>(
  response: Response
): Promise<TResponse | { message?: string } | null> => {
  const rawText = await response.text();
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as TResponse | { message?: string };
  } catch {
    return { message: rawText };
  }
};

const handleResponse = async <TResponse>(response: Response): Promise<TResponse> => {
  const data = await parseResponse<TResponse>(response);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && data.message
        ? data.message
        : 'Request failed. Please try again.';
    throw buildError(message, response.status);
  }

  return data as TResponse;
};

export const getRequest = async <TResponse>(
  url: string,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(options?.headers ?? {}),
    },
  });

  return handleResponse<TResponse>(response);
};

export const postRequest = async <TResponse, TPayload>(
  url: string,
  payload: TPayload,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<TResponse>(response);
};

export const putRequest = async <TResponse, TPayload>(
  url: string,
  payload: TPayload,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<TResponse>(response);
};

export const deleteRequest = async <TResponse>(
  url: string,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...(options?.headers ?? {}),
    },
  });

  return handleResponse<TResponse>(response);
};
