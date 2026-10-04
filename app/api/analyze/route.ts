import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Función para calcular hashes del archivo
async function calculateHashes(buffer: Buffer) {
  return {
    md5: crypto.createHash('md5').update(buffer).digest('hex'),
    sha1: crypto.createHash('sha1').update(buffer).digest('hex'),
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
  };
}

// Función para consultar VirusTotal (sin API key, usando página pública)
async function checkVirusTotal(sha256: string) {
  try {
    const url = `https://www.virustotal.com/gui/file/${sha256}`;

    return {
      name: 'VirusTotal',
      detected: false,
      info: 'Consulta el hash en VirusTotal manualmente',
      url: url,
      error: null,
    };
  } catch (error) {
    return {
      name: 'VirusTotal',
      detected: false,
      error: 'No se pudo verificar',
      url: `https://www.virustotal.com/gui/file/${sha256}`,
    };
  }
}

// Función para consultar Hybrid Analysis
async function checkHybridAnalysis(sha256: string) {
  try {
    const url = `https://www.hybrid-analysis.com/search?query=${sha256}`;

    return {
      name: 'Hybrid Analysis',
      detected: false,
      info: 'Consulta el hash en Hybrid Analysis manualmente',
      url: url,
      error: null,
    };
  } catch (error) {
    return {
      name: 'Hybrid Analysis',
      detected: false,
      error: 'No se pudo verificar',
      url: `https://www.hybrid-analysis.com/search?query=${sha256}`,
    };
  }
}

// Función para consultar AlienVault OTX
async function checkAlienVault(sha256: string) {
  try {
    const response = await fetch(
      `https://otx.alienvault.com/api/v1/indicators/file/${sha256}/general`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const pulseCount = data.pulse_info?.count || 0;

      return {
        name: 'AlienVault OTX',
        detected: pulseCount > 0,
        info: pulseCount > 0
          ? `Encontrado en ${pulseCount} pulso(s) de amenazas`
          : 'No encontrado en bases de datos de amenazas',
        url: `https://otx.alienvault.com/indicator/file/${sha256}`,
        error: null,
      };
    }

    return {
      name: 'AlienVault OTX',
      detected: false,
      info: 'No encontrado',
      url: `https://otx.alienvault.com/indicator/file/${sha256}`,
      error: null,
    };
  } catch (error) {
    return {
      name: 'AlienVault OTX',
      detected: false,
      error: 'Error al consultar el servicio',
      url: `https://otx.alienvault.com/indicator/file/${sha256}`,
    };
  }
}

// Función para consultar MalwareBazaar (enlace manual debido a restricciones de API)
async function checkMalwareBazaar(sha256: string) {
  return {
    name: 'MalwareBazaar',
    detected: false,
    info: 'Consulta el hash manualmente (API requiere autenticación)',
    url: `https://bazaar.abuse.ch/browse.php?search=sha256%3A${sha256}`,
    error: null,
  };
}

// Función para consultar ThreatFox (enlace manual debido a restricciones de API)
async function checkThreatFox(sha256: string) {
  return {
    name: 'ThreatFox',
    detected: false,
    info: 'Consulta el hash manualmente (API requiere autenticación)',
    url: `https://threatfox.abuse.ch/browse.php?search=sha256%3A${sha256}`,
    error: null,
  };
}

// Función para consultar URLhaus (servicio alternativo de abuse.ch)
async function checkURLhaus(sha256: string) {
  return {
    name: 'URLhaus',
    detected: false,
    info: 'Consulta el hash en URLhaus (base de datos de URLs maliciosas)',
    url: `https://urlhaus.abuse.ch/browse.php?search=sha256%3A${sha256}`,
    error: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Verificar tamaño
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo de 50MB' },
        { status: 400 }
      );
    }

    // Leer el archivo como buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Calcular hashes
    const hashes = await calculateHashes(buffer);

    // Consultar servicios en paralelo
    const serviceResults = await Promise.all([
      checkAlienVault(hashes.sha256),
      checkVirusTotal(hashes.sha256),
      checkHybridAnalysis(hashes.sha256),
      checkMalwareBazaar(hashes.sha256),
      checkThreatFox(hashes.sha256),
      checkURLhaus(hashes.sha256),
    ]);

    return NextResponse.json({
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      hashes,
      services: serviceResults,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo' },
      { status: 500 }
    );
  }
}
