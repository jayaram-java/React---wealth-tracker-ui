import { generateRequestId, encryptPayload, decryptPayload } from '../utils/crypto';

export interface ApiError extends Error {
  status?: number;
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  skipLoader?: boolean;
}

type SessionTimeoutHandler = (() => void) | null;
type LoaderListener = () => void;

let onSessionTimeout: SessionTimeoutHandler = null;
const loaderListeners = new Set<LoaderListener>();
let activeRequestCount = 0;

export const setSessionTimeoutHandler = (handler: SessionTimeoutHandler) => {
  onSessionTimeout = handler;
};

export const subscribeToLoader = (listener: LoaderListener): (() => void) => {
  loaderListeners.add(listener);
  return () => {
    loaderListeners.delete(listener);
  };
};

export const getActiveRequestCount = (): number => activeRequestCount;

const notifyLoaderListeners = () => {
  loaderListeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error in loader listener:', err);
    }
  });
};

export const startLoading = () => {
  activeRequestCount++;
  notifyLoaderListeners();
};

export const stopLoading = () => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  notifyLoaderListeners();
};

export const resetLoader = () => {
  activeRequestCount = 0;
  notifyLoaderListeners();
};

const buildError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
};

const handleUnauthorized = () => {
  onSessionTimeout?.();
};

const isEncryptionEnabled = import.meta.env.VITE_ENABLE_ENCRYPTION === 'true';
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY ?? '';

// Fail explicitly on mode/key mismatch
if (isEncryptionEnabled) {
  if (!encryptionKey || encryptionKey.trim() === '') {
    throw new Error('VITE_ENCRYPTION_KEY is required when VITE_ENABLE_ENCRYPTION is true');
  }
  try {
    const rawKey = window.atob(encryptionKey);
    if (rawKey.length !== 32) {
      throw new Error(`Decoded VITE_ENCRYPTION_KEY length is ${rawKey.length} bytes, expected 32`);
    }
  } catch (err) {
    throw new Error(`Invalid VITE_ENCRYPTION_KEY: must be a Base64-encoded 32-byte key. Error: ${(err as Error).message}`);
  }
}

const shouldEncrypt = (url: string): boolean => {
  if (!isEncryptionEnabled) {
    return false;
  }
  const lowerUrl = url.toLowerCase();
  return !(
    lowerUrl.includes('/actuator') ||
    lowerUrl.includes('/swagger-ui') ||
    lowerUrl.includes('/v3/api-docs') ||
    lowerUrl.includes('/error') ||
    lowerUrl.endsWith('/documents/expense/pdf')
  );
};

const attachHeaders = (
  options?: ApiRequestOptions,
  includeContentType = false
): Record<string, string> => ({
  ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
  ...(options?.headers ?? {}),
});

interface DecryptedEnvelope<T> {
  authRequestId: string;
  resultData: T;
}

const performRequest = async <TResponse>(
  url: string,
  method: string,
  bodyPayload?: unknown,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const showLoader = !options?.skipLoader;
  if (showLoader) {
    startLoading();
  }

  try {
    const encryptReq = shouldEncrypt(url);
    const requestId = encryptReq ? generateRequestId() : undefined;

    let headers = attachHeaders(options, bodyPayload !== undefined);

    if (encryptReq && requestId) {
      headers = {
        ...headers,
        'X-Auth-Request-Id': requestId,
      };
    }

    let body: BodyInit | undefined = undefined;
    if (bodyPayload !== undefined) {
      const jsonStr = JSON.stringify(bodyPayload);
      if (encryptReq && requestId) {
        const encrypted = await encryptPayload(jsonStr, requestId, encryptionKey);
        body = encrypted;
        headers = {
          ...headers,
          'X-Content-Encryption': 'AES-256-GCM',
        };
      } else {
        body = jsonStr;
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseRequestId = response.headers.get('X-Auth-Request-Id');

    if (response.status === 401) {
      handleUnauthorized();
    }

    if (response.status === 204) {
      if (encryptReq && requestId) {
        if (responseRequestId !== requestId) {
          throw buildError('Request ID binding verification failed', response.status);
        }
      }
      if (!response.ok) {
        throw buildError('Request failed', response.status);
      }
      return null as TResponse;
    }

    const isEncrypted = response.headers.get('X-Content-Encryption') === 'AES-256-GCM';
    let responseData: unknown = null;

    if (isEncrypted && encryptReq && requestId) {
      const rawText = await response.text();
      if (rawText) {
        try {
          const decryptedText = await decryptPayload(rawText, requestId, encryptionKey);
          const envelope = JSON.parse(decryptedText) as DecryptedEnvelope<TResponse>;
          if (envelope.authRequestId !== requestId) {
            throw buildError('Request ID binding verification failed', response.status);
          }
          responseData = envelope.resultData;
        } catch (err) {
          if ((err as ApiError).status !== undefined) {
            throw err;
          }
          throw buildError('Failed to decrypt response or verify binding', response.status);
        }
      }
    } else {
      const rawText = await response.text();
      if (rawText) {
        try {
          responseData = JSON.parse(rawText);
        } catch {
          responseData = { message: rawText };
        }
      }
    }

    if (!response.ok) {
      const message =
        responseData && typeof responseData === 'object' && 'message' in responseData && typeof (responseData as { message?: unknown }).message === 'string'
          ? (responseData as { message: string }).message
          : response.status === 401
            ? 'Your session has expired. Please sign in again.'
            : 'Request failed. Please try again.';
      throw buildError(message, response.status);
    }

    return responseData as TResponse;
  } finally {
    if (showLoader) {
      stopLoading();
    }
  }
};

export const getRequest = async <TResponse>(
  url: string,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  return performRequest<TResponse>(url, 'GET', undefined, options);
};

export const postRequest = async <TResponse, TPayload>(
  url: string,
  payload: TPayload,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  return performRequest<TResponse>(url, 'POST', payload, options);
};

export const putRequest = async <TResponse, TPayload>(
  url: string,
  payload: TPayload,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  return performRequest<TResponse>(url, 'PUT', payload, options);
};

export const deleteRequest = async <TResponse>(
  url: string,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  return performRequest<TResponse>(url, 'DELETE', undefined, options);
};

export const postMultipartRequest = async <TResponse>(
  url: string,
  formData: FormData,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const showLoader = !options?.skipLoader;
  if (showLoader) {
    startLoading();
  }

  try {
    const headers = {
      ...(options?.headers ?? {}),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      handleUnauthorized();
    }

    if (response.status === 204) {
      if (!response.ok) {
        throw buildError('Request failed', response.status);
      }
      return null as TResponse;
    }

    const rawText = await response.text();
    let responseData: unknown = null;
    if (rawText) {
      try {
        responseData = JSON.parse(rawText);
      } catch {
        responseData = { message: rawText };
      }
    }

    if (!response.ok) {
      const message =
        responseData && typeof responseData === 'object' && 'message' in responseData && typeof (responseData as { message?: unknown }).message === 'string'
          ? (responseData as { message: string }).message
          : response.status === 401
            ? 'Your session has expired. Please sign in again.'
            : 'Request failed. Please try again.';
      throw buildError(message, response.status);
    }

    return responseData as TResponse;
  } finally {
    if (showLoader) {
      stopLoading();
    }
  }
};

export const getBlobRequest = async (
  url: string,
  options?: ApiRequestOptions
): Promise<Blob> => {
  const showLoader = !options?.skipLoader;
  if (showLoader) {
    startLoading();
  }

  try {
    const encryptReq = shouldEncrypt(url);
    const requestId = encryptReq ? generateRequestId() : undefined;

    let headers = attachHeaders(options, false);

    if (encryptReq && requestId) {
      headers = {
        ...headers,
        'X-Auth-Request-Id': requestId,
      };
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (response.status === 401) {
      handleUnauthorized();
    }

    if (!response.ok) {
      const rawText = await response.text();
      let responseData: unknown = null;
      if (rawText) {
        try {
          responseData = JSON.parse(rawText);
        } catch {
          responseData = { message: rawText };
        }
      }
      const message =
        responseData && typeof responseData === 'object' && 'message' in responseData && typeof (responseData as { message?: unknown }).message === 'string'
          ? (responseData as { message: string }).message
          : response.status === 401
            ? 'Your session has expired. Please sign in again.'
            : 'Request failed. Please try again.';
      throw buildError(message, response.status);
    }

    return await response.blob();
  } finally {
    if (showLoader) {
      stopLoading();
    }
  }
};
