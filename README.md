# 🛡️ Hash Checker - Analizador de Malware

Aplicación web para analizar archivos y verificar si son malware consultando múltiples bases de datos de seguridad sin necesidad de API keys.

## 🚀 Características

- ✅ **Sin API Keys requeridas** - Funciona sin necesidad de registrarse en servicios externos
- 📁 **Soporte de archivos hasta 50MB**
- 🔐 **Múltiples algoritmos de hash** - MD5, SHA-1, SHA-256
- 🌐 **Consulta a múltiples servicios**:
  - AlienVault OTX
  - MalwareBazaar
  - ThreatFox
  - VirusTotal (enlace manual)
  - Hybrid Analysis (enlace manual)
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

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/hash-checker)

1. Haz fork o clona este repositorio
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente Next.js y configurará el build
4. ¡Despliega!

## 📝 Uso

1. Arrastra un archivo o haz clic para seleccionarlo (máximo 50MB)
2. Haz clic en "Analizar Archivo"
3. La aplicación calculará los hashes del archivo
4. Consultará automáticamente múltiples servicios de seguridad
5. Verás los resultados con indicadores visuales de seguridad

## 🔒 Servicios de Consulta

### Con API Pública (sin autenticación):
- **AlienVault OTX** - Base de datos de amenazas colaborativa
- **MalwareBazaar** - Repositorio de muestras de malware
- **ThreatFox** - Base de datos de indicadores de compromiso

### Enlaces Manuales:
- **VirusTotal** - 70+ motores antivirus
- **Hybrid Analysis** - Análisis dinámico de malware

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
- No se requiere autenticación ni API keys
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
