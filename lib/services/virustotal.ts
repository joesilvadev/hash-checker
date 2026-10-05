import type { ServiceResult } from './types';
import { errorResult, fetchWithTimeout, messageOf, notConfigured } from './http';

/**
 * VirusTotal API v3.
 * Clave pública gratuita (no comercial): 500 peticiones/día, 4 por minuto.
 * https://docs.virustotal.com/reference/public-vs-premium-api
 */
export async function checkVirusTotal(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'VirusTotal';
  const url = `https://www.virustotal.com/gui/file/${sha256}`;

  if (!apiKey) return notConfigured(name, url, 'VIRUSTOTAL_API_KEY');

  try {
    const response = await fetchWithTimeout(
      `https://www.virustotal.com/api/v3/files/${sha256}`,
      { headers: { 'x-apikey': apiKey } }
    );

    if (response.status === 404) {
      return {
        name,
        status: 'unknown',
        info: 'Hash no analizado todavía en VirusTotal',
        url,
        error: null,
      };
    }
    if (response.status === 401) return errorResult(name, url, 'API key de VirusTotal inválida');
    if (response.status === 429) {
      return errorResult(name, url, 'Límite de VirusTotal alcanzado (500/día, 4/min)');
    }
    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const stats = data?.data?.attributes?.last_analysis_stats ?? {};
    const malicious = Number(stats.malicious ?? 0);
    const suspicious = Number(stats.suspicious ?? 0);
    const total =
      malicious +
      suspicious +
      Number(stats.harmless ?? 0) +
      Number(stats.undetected ?? 0) +
      Number(stats.timeout ?? 0) +
      Number(stats['confirmed-timeout'] ?? 0) +
      Number(stats.failure ?? 0) +
      Number(stats['type-unsupported'] ?? 0);

    if (malicious > 0 || suspicious > 0) {
      const extra = suspicious > 0 ? ` (+${suspicious} sospechoso)` : '';
      return {
        name,
        status: 'malicious',
        info: `Detectado por ${malicious} de ${total} motores antivirus${extra}`,
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'clean',
      info: `Sin detecciones: 0 de ${total} motores antivirus`,
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}