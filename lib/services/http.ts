import type { ServiceResult } from './types';

const DEFAULT_TIMEOUT_MS = 15_000;

/** `fetch` con timeout para no dejar colgada la función de Vercel. */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
}

export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Error desconocido';
}

/** Resultado para un servicio cuya clave no está configurada. */
export function notConfigured(name: string, url: string, envVar: string): ServiceResult {
  return {
    name,
    status: 'error',
    info: `Servicio no configurado — falta la variable de entorno ${envVar}`,
    url,
    error: 'No configurado',
  };
}

/** Resultado de error genérico para una consulta fallida. */
export function errorResult(name: string, url: string, message: string): ServiceResult {
  return {
    name,
    status: 'error',
    info: 'No se pudo consultar el servicio',
    url,
    error: message,
  };
}