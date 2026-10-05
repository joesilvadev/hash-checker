import type { ServiceResult } from './types';
import { errorResult, fetchWithTimeout, messageOf, notConfigured } from './http';

/**
 * Hybrid Analysis (Falcon Sandbox) API v2.
 * Clave gratuita previo registro. Requiere el User-Agent "Falcon Sandbox".
 * https://hybrid-analysis.com/docs/api/v2
 *
 * `GET /search/hash` devuelve `{ sha256s, reports: [...] }`; cada informe
 * incluye al menos `verdict`. Se mantiene compatibilidad con la forma de array
 * (endpoint POST heredado).
 */

const VERDICT_RANK: Record<string, number> = {
  malicious: 3,
  suspicious: 2,
  'no specific threat': 1,
  'no threat': 1,
  whitelisted: 0,
};

function verdictRank(verdict: string): number {
  return VERDICT_RANK[verdict.toLowerCase()] ?? -1;
}

export async function checkHybridAnalysis(
  sha256: string,
  apiKey: string | null
): Promise<ServiceResult> {
  const name = 'Hybrid Analysis';
  const url = `https://www.hybrid-analysis.com/sample/${sha256}`;

  if (!apiKey) return notConfigured(name, url, 'HYBRID_ANALYSIS_API_KEY');

  try {
    const response = await fetchWithTimeout(
      `https://www.hybrid-analysis.com/api/v2/search/hash?hash=${sha256}`,
      {
        headers: {
          'api-key': apiKey,
          'User-Agent': 'Falcon Sandbox',
          accept: 'application/json',
        },
      }
    );

    if (response.status === 404) {
      return {
        name,
        status: 'unknown',
        info: 'Hash no analizado todavía en Hybrid Analysis',
        url,
        error: null,
      };
    }
    if (response.status === 401 || response.status === 403) {
      return errorResult(name, url, 'API key de Hybrid Analysis inválida o incompatible con la API v2');
    }
    if (response.status === 429) {
      return errorResult(name, url, 'Límite de Hybrid Analysis alcanzado');
    }
    if (!response.ok) return errorResult(name, url, `HTTP ${response.status}`);

    const data = await response.json();
    const reports: Array<Record<string, unknown>> = Array.isArray(data)
      ? data
      : Array.isArray(data?.reports)
      ? data.reports
      : [];

    if (reports.length === 0) {
      return {
        name,
        status: 'unknown',
        info: 'Hash no analizado todavía en Hybrid Analysis',
        url,
        error: null,
      };
    }

    // Nos quedamos con el veredicto más grave entre todos los informes.
    const best = reports.reduce((a, b) => (verdictRank(String(b.verdict ?? '')) > verdictRank(String(a.verdict ?? '')) ? b : a));
    const verdict = String(best.verdict ?? '').toLowerCase();
    const score = Number(best.threat_score ?? 0);
    const family = String(best.vx_family ?? '').trim();
    const rank = verdictRank(verdict);

    if (rank >= 2 || score >= 50) {
      const level = verdict || 'sospechoso';
      const scoreText = score > 0 ? ` · puntuación ${score}/100` : '';
      return {
        name,
        status: 'malicious',
        info: `Veredicto ${level}${scoreText}${family ? ` · familia ${family}` : ''}`,
        url,
        error: null,
      };
    }

    if (rank >= 0) {
      const scoreText = score > 0 ? ` (puntuación ${score}/100)` : '';
      return {
        name,
        status: 'clean',
        info: `Sin amenazas (veredicto ${verdict}${scoreText})`,
        url,
        error: null,
      };
    }

    return {
      name,
      status: 'unknown',
      info: 'Hay informes de sandbox pero sin veredicto concluyente',
      url,
      error: null,
    };
  } catch (error) {
    return errorResult(name, url, messageOf(error));
  }
}