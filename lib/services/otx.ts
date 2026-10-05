import type { ServiceResult } from './types';
import { errorResult, fetchWithTimeout, messageOf } from './http';

/**
 * AlienVault OTX (Open Threat Exchange).
 * Funciona sin clave (1.000 req/hora); con una clave gratuita sube a 10.000.
 * La clave es opcional, por lo que no se marca como "no configurado".
 */
export async function checkOtx(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'AlienVault OTX';
  const url = `https://otx.alienvault.com/indicator/file/${sha256}`;

  const headers: Record<string, string> = { 'User-Agent': 'hash-checker' };
  if (apiKey) headers['X-OTX-API-KEY'] = apiKey;

  try {
    const response = await fetchWithTimeout(
      `https://otx.alienvault.com/api/v1/indicators/file/${sha256}/general`,
      { headers }
    );

    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const count = Number(data?.pulse_info?.count ?? 0);
    const pulses = Array.isArray(data?.pulse_info?.pulses) ? data.pulse_info.pulses : [];

    if (count > 0) {
      const names = pulses
        .slice(0, 2)
        .map((pulse: Record<string, unknown>) => String(pulse.name ?? ''))
        .filter(Boolean)
        .join(', ');
      return {
        name,
        status: 'malicious',
        info: `Encontrado en ${count} pulso(s) de amenazas${names ? `: ${names}` : ''}`,
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'unknown',
      info: 'Sin pulses asociados en AlienVault OTX',
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}