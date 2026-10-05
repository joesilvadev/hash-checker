/**
 * Tipos compartidos por la capa de consulta a servicios de reputación.
 */

/**
 * Estado de una consulta:
 * - `malicious`: la fuente reconoce el hash como malicioso.
 * - `clean`: la fuente analizó el hash y no encontró amenazas.
 * - `unknown`: la fuente no tiene información sobre ese hash (no es lo mismo que
 *   estar limpio).
 * - `error`: no se pudo completar la consulta (falta clave, red, límite, etc.).
 */
export type ServiceStatus = 'malicious' | 'clean' | 'unknown' | 'error';

export interface ServiceResult {
  name: string;
  status: ServiceStatus;
  info: string;
  url: string;
  error: string | null;
}

export interface FileHashes {
  md5: string;
  sha1: string;
  sha256: string;
}

/** Claves de API leídas del entorno. `null` cuando no están configuradas. */
export interface ApiKeys {
  abuseCh: string | null;
  virusTotal: string | null;
  hybridAnalysis: string | null;
  otx: string | null;
}