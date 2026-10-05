import type { ApiKeys, FileHashes, ServiceResult } from './types';
import { checkMalwareBazaar, checkThreatFox, checkURLhaus } from './abusec';
import { checkVirusTotal } from './virustotal';
import { checkHybridAnalysis } from './hybridAnalysis';
import { checkOtx } from './otx';

export type { ApiKeys, FileHashes, ServiceResult, ServiceStatus } from './types';

/**
 * Consulta todas las fuentes de reputación en paralelo.
 * Cada servicio es responsable de devolver siempre un `ServiceResult`, incluso
 * ante errores; el `catch` final es una red de seguridad para fallos inesperados.
 */
export async function runAllServices(
  hashes: FileHashes,
  keys: ApiKeys
): Promise<ServiceResult[]> {
  const tasks: Array<Promise<ServiceResult>> = [
    checkMalwareBazaar(hashes.sha256, keys.abuseCh),
    checkThreatFox(hashes.sha256, keys.abuseCh),
    checkURLhaus(hashes.sha256, keys.abuseCh),
    checkVirusTotal(hashes.sha256, keys.virusTotal),
    checkHybridAnalysis(hashes.sha256, keys.hybridAnalysis),
    checkOtx(hashes.sha256, keys.otx),
  ];

  return Promise.all(
    tasks.map((task) =>
      task.catch((error: unknown): ServiceResult => ({
        name: 'Desconocido',
        status: 'error',
        info: 'Error inesperado al consultar el servicio',
        url: '',
        error: error instanceof Error ? error.message : 'Error desconocido',
      }))
    )
  );
}