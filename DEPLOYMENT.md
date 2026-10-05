# 🚀 Guía de Despliegue - Hash Checker

## 📋 Pasos para subir a GitHub

### 1. Crear repositorio en GitHub

Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio:
- **Nombre:** `hash-checker` (o el que prefieras)
- **Descripción:** "Aplicación web para análisis de hashes de archivos y detección de malware"
- **Visibilidad:** Público o Privado
- **NO inicialices con README, .gitignore o licencia** (ya los tenemos)

### 2. Conectar tu repositorio local con GitHub

Una vez creado el repositorio en GitHub, ejecuta estos comandos:

```bash
git remote add origin https://github.com/joesilvadev/hash-checker.git
git push -u origin master
```

## 🌐 Desplegar en Vercel

### Opción 1: Despliegue directo desde Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"Add New..."** → **"Project"**
4. Importa tu repositorio `hash-checker`
5. Vercel detectará automáticamente que es un proyecto Next.js
6. Haz clic en **"Deploy"**
7. ¡Listo! Tu aplicación estará en línea en menos de 2 minutos

### Opción 2: Usando Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link

# Claves en producción (repite con `preview` y `development` si las quieres ahí)
vercel env add ABUSECH_AUTH_KEY production
vercel env add VIRUSTOTAL_API_KEY production
vercel env add HYBRID_ANALYSIS_API_KEY production

vercel deploy --prod
```

Producción actual: **https://hash-checker-phi.vercel.app**

> El proyecto ya está vinculado a Vercel y el repositorio de GitHub está conectado, por lo
> que cada `git push` a `master` genera un despliegue automático en producción.

## ✅ Verificación

Después del despliegue:

1. Vercel te dará una URL como: `https://hash-checker-xxxxx.vercel.app`
2. Prueba subir un archivo
3. Verifica que los hashes se calculen correctamente
4. Comprueba que los enlaces a los servicios funcionen

## 🔧 Configuración Adicional (Opcional)

### Dominio personalizado

En Vercel → Settings → Domains, puedes agregar un dominio personalizado.

### Variables de entorno (obligatorio)

La app consulta APIs que requieren claves **gratuitas**. Antes de desplegar:

1. Ve a Vercel → tu proyecto → **Settings → Environment Variables**
2. Agrega estas variables (igual que en tu `.env.local`):

   | Variable | Obligatoria | Dónde conseguirla |
   |---|---|---|
   | `ABUSECH_AUTH_KEY` | Sí (cubre 3 servicios) | [auth.abuse.ch](https://auth.abuse.ch/) |
   | `VIRUSTOTAL_API_KEY` | Sí | [virustotal.com/gui/my-apikey](https://www.virustotal.com/gui/my-apikey) |
   | `HYBRID_ANALYSIS_API_KEY` | Sí | [hybrid-analysis.com](https://www.hybrid-analysis.com/) |
   | `OTX_API_KEY` | No (opcional) | [otx.alienvault.com/api](https://otx.alienvault.com/api) |

3. Redespliega la aplicación para que tomen efecto.

## 📝 Actualizaciones futuras

Cada vez que hagas cambios y los subas a GitHub:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel desplegará automáticamente los cambios en producción.

## 🛡️ Servicios integrados

La aplicación usa APIs JSON oficiales (claves gratuitas vía variables de entorno):

- ✅ **abuse.ch** (MalwareBazaar, ThreatFox, URLhaus) — 1 Auth-Key compartida
- ✅ **VirusTotal** — API v3, 70+ motores antivirus (500/día, uso no comercial)
- ✅ **Hybrid Analysis** — API v2 (sandbox)
- ✅ **AlienVault OTX** — funciona incluso sin clave

## 📊 Características principales

- 📁 Carga de archivos hasta 50MB
- 🔐 Cálculo de hashes MD5, SHA-1, SHA-256
- 🌐 Consulta automática a múltiples bases de datos vía API JSON
- 🎨 Interfaz responsive con modo oscuro
- 🔑 Claves de API gestionadas por variables de entorno
- 🔒 Procesamiento en memoria (no se almacenan archivos)

## 🆘 Solución de problemas

### Error al hacer push

Si recibes un error al hacer push, verifica que:
- Hayas creado el repositorio en GitHub
- La URL remota sea correcta: `git remote -v`
- Tengas permisos para el repositorio

### Error en el build de Vercel

- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel
- Asegúrate de que `npm run build` funcione localmente

## 🎯 Próximas mejoras sugeridas

- [ ] Agregar más servicios de análisis
- [ ] Implementar API keys opcionales para servicios premium
- [ ] Caché de resultados
- [ ] Historial de análisis
- [ ] Exportación de reportes en PDF
- [ ] Análisis batch de múltiples archivos

---

¡Tu aplicación está lista para ser usada! 🎉
