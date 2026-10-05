import type { ServiceResult } from './types';
import { errorResult, fetchWithTimeout, messageOf, notConfigured } from './http';

/**
 * Servicios de abuse.ch (MalwareBazaar, ThreatFox, URLhaus).
 * Todos comparten una única `Auth-Key` gratuita (https://auth.abuse.ch/),
 * enviada en la cabecera `Auth-Key`.
 */

function abuseChAuthFailed(name: string, url: string, status: number): ServiceResult {
  return errorResult(name, url, `Auth-Key de abuse.ch rechazada (HTTP ${status})`);
}

// ---------------------------------------------------------------------------
// MalwareBazaar
// ---------------------------------------------------------------------------
export async function checkMalwareBazaar(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'MalwareBazaar';
  const url = `https://bazaar.abuse.ch/sample/${sha256}/`;

  if (!apiKey) return notConfigured(name, url, 'ABUSECH_AUTH_KEY');

  try {
    const response = await fetchWithTimeout('https://mb-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: {
        'Auth-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ query: 'get_info', hash: sha256 }).toString(),
    });

    if (response.status === 401 || response.status === 403) {
      return abuseChAuthFailed(name, url, response.status);
    }
    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const queryStatus: string | undefined = data?.query_status;

    if (queryStatus === 'ok' && Array.isArray(data?.data) && data.data.length > 0) {
      const sample = data.data[0] as Record<string, unknown>;
      const family = String(sample.signature ?? sample.file_type_mime ?? '').trim();
      return {
        name,
        status: 'malicious',
        info: family
          ? `Muestra de malware identificada: ${family}`
          : 'Muestra de malware encontrada en la base de datos',
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'unknown',
      info: 'Hash no encontrado en la base de datos de MalwareBazaar',
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}

// ---------------------------------------------------------------------------
// ThreatFox
// ---------------------------------------------------------------------------
export async function checkThreatFox(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'ThreatFox';
  const url = `https://threatfox.abuse.ch/browse.php?search=sha256%3A${sha256}`;

  if (!apiKey) return notConfigured(name, url, 'ABUSECH_AUTH_KEY');

  try {
    const response = await fetchWithTimeout('https://threatfox-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: {
        'Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'search_ioc', search_term: sha256 }),
    });

    if (response.status === 401 || response.status === 403) {
      return abuseChAuthFailed(name, url, response.status);
    }
    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const queryStatus: string | undefined = data?.query_status;

    if (queryStatus === 'ok' && Array.isArray(data?.data) && data.data.length > 0) {
      const ioc = data.data[0] as Record<string, unknown>;
      const malware = String(ioc.malware_printable ?? ioc.malware ?? '').trim();
      const threatType = String(ioc.threat_type ?? '').trim();
      const details = [threatType, malware].filter(Boolean).join(' · ');
      return {
        name,
        status: 'malicious',
        info: details
          ? `Indicador de compromiso: ${details}`
          : 'Indicador de compromiso malicioso encontrado',
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'unknown',
      info: 'Hash no encontrado entre los indicadores de compromiso de ThreatFox',
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}

// ---------------------------------------------------------------------------
// URLhaus
// ---------------------------------------------------------------------------
export async function checkURLhaus(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'URLhaus';
  const url = `https://urlhaus.abuse.ch/browse.php?search=sha256%3A${sha256}`;

  if (!apiKey) return notConfigured(name, url, 'ABUSECH_AUTH_KEY');

  try {
    const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/payload/', {
      method: 'POST',
      headers: {
        'Auth-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ sha256 }).toString(),
    });

    if (response.status === 401 || response.status === 403) {
      return abuseChAuthFailed(name, url, response.status);
    }
    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const queryStatus: string | undefined = data?.query_status;

    if (queryStatus === 'ok') {
      const urlCount = Number(data?.url_count ?? (Array.isArray(data?.urls) ? data.urls.length : 0));
      const family = String(data?.signature ?? '').trim();
      return {
        name,
        status: 'malicious',
        info:
          urlCount > 0
            ? `${urlCount} URL(s) maliciosa(s) distribuyen este archivo${family ? ` (${family})` : ''}`
            : `Archivo malicioso detectado${family ? ` (${family})` : ''}`,
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'unknown',
      info: 'Hash no encontrado en URLhaus',
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}