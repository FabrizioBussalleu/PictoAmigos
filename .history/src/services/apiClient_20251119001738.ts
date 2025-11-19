import { appConfig } from '../config';

export interface ApiError {
  status: number;
  message: string;
  cause?: unknown;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw {
      status: response.status,
      message: message || 'Request failed',
    } satisfies ApiError;
  }

  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const url = `${appConfig.apiBaseUrl}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  return handleResponse<T>(response);
}
