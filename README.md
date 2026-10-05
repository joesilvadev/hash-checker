# 🛡️ Hash Checker - Analizador de Malware

Aplicación web para analizar archivos y verificar si son malware consultando múltiples bases de datos de seguridad mediante APIs JSON oficiales.

🔗 **Demo en vivo:** [hash-checker-phi.vercel.app](https://hash-checker-phi.vercel.app)

## 🚀 Características

- 🔑 **APIs oficiales gratuitas** - Consulta las APIs JSON de abuse.ch, VirusTotal y Hybrid Analysis (registro gratis, sin coste)
- 📁 **Soporte de archivos hasta 50MB**
- 🔐 **Múltiples algoritmos de hash** - MD5, SHA-1, SHA-256
- 🌐 **Consulta a múltiples servicios**:
  - AlienVault OTX (funciona sin clave)
  - MalwareBazaar, ThreatFox y URLhaus (abuse.ch)
  - VirusTotal (70+ motores antivirus)
  - Hybrid Analysis (sandbox / Falcon Sandbox)
- 🎨 **Interfaz moderna y responsive**
- 🌙 **Modo oscuro automático**
- ⚡ **Desplegado en Vercel**

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Node.js Crypto** - Cálculo de hashes
- **Vercel** - Hosting y deployment

## 📦 Instalación Local

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd hash-checker
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura tus claves de API (gratuitas). Copia el ejemplo y rellénalo:
```bash
cp .env.local.example .env.local
```
   - **ABUSECH_AUTH_KEY** → una sola clave para MalwareBazaar, ThreatFox y URLhaus ([auth.abuse.ch](https://auth.abuse.ch/))
   - **VIRUSTOTAL_API_KEY** → [virustotal.com](https://www.virustotal.com/gui/my-apikey) (pública, uso no comercial)
   - **HYBRID_ANALYSIS_API_KEY** → [hybrid-analysis.com](https://www.hybrid-analysis.com/)
   - **OTX_API_KEY** → opcional; OTX funciona sin clave

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/joesilvadev/hash-checker)

El repositorio ya está conectado a Vercel: **cada `git push` a `master` despliega automáticamente en producción**.

1. Importa el proyecto en [Vercel](https://vercel.com) (detección automática de Next.js)
2. En **Settings → Environment Variables** añade las claves (`ABUSECH_AUTH_KEY`, `VIRUSTOTAL_API_KEY`, `HYBRID_ANALYSIS_API_KEY`; `OTX_API_KEY` es opcional)
3. Despliega

O con la CLI:

```bash
vercel link
vercel env add ABUSECH_AUTH_KEY production
vercel env add VIRUSTOTAL_API_KEY production
vercel env add HYBRID_ANALYSIS_API_KEY production
vercel deploy --prod
```

## 📝 Uso

1. Arrastra un archivo o haz clic para seleccionarlo (máximo 50MB)
2. Haz clic en "Analizar Archivo"
3. La aplicación calculará los hashes del archivo
4. Consultará automáticamente múltiples servicios de seguridad
5. Verás los resultados con indicadores visuales de seguridad

## 🔒 Servicios de Consulta

Todos mediante **API JSON oficial** (sin scraping):

| Servicio | Clave | Cobertura |
|---|---|---|
| **abuse.ch** (MalwareBazaar, ThreatFox, URLhaus) | 1 Auth-Key gratuita compartida | Muestras de malware, IOCs y URLs maliciosas |
| **VirusTotal** | Clave pública gratuita (500/día, 4/min) | 70+ motores antivirus |
| **Hybrid Analysis** | Clave gratuita | Sandbox y familia de malware |
| **AlienVault OTX** | Opcional | Base de datos de amenazas colaborativa |

Si una clave no está configurada, ese servicio se muestra como "No disponible" y el análisis continúa con el resto.

## 🎯 Casos de Uso

- Verificación de archivos descargados
- Análisis forense digital
- Educación en ciberseguridad
- CTF y desafíos de seguridad
- Investigación de malware

## ⚠️ Consideraciones de Seguridad

- Los archivos se procesan en memoria y no se almacenan
- Solo se calculan hashes, no se ejecuta código
- Las consultas son de solo lectura
- Las claves de API viven en variables de entorno y nunca se exponen al cliente
- Límite de 50MB por razones de rendimiento

## 📄 Licencia

MIT License - Siéntete libre de usar, modificar y distribuir.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Desarrollado para educación en ciberseguridad.

---

⚡ Desarrollado con Next.js y desplegado en Vercel
