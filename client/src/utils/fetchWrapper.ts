// In production (Kubernetes), use relative path which is handled by Ingress
// In development, use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export async function fetchWrapper<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
