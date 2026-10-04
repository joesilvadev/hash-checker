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
git branch -M main
git push -u origin main
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
vercel
```

Sigue las instrucciones en pantalla y Vercel desplegará tu aplicación automáticamente.

## ✅ Verificación

Después del despliegue:

1. Vercel te dará una URL como: `https://hash-checker-xxxxx.vercel.app`
2. Prueba subir un archivo
3. Verifica que los hashes se calculen correctamente
4. Comprueba que los enlaces a los servicios funcionen

## 🔧 Configuración Adicional (Opcional)

### Dominio personalizado

En Vercel → Settings → Domains, puedes agregar un dominio personalizado.

### Variables de entorno

Si en el futuro quieres agregar API keys:
1. Ve a Vercel → Settings → Environment Variables
2. Agrega las variables necesarias
3. Redespliega la aplicación

## 📝 Actualizaciones futuras

Cada vez que hagas cambios y los subas a GitHub:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel desplegará automáticamente los cambios en producción.

## 🛡️ Servicios integrados

La aplicación consulta estos servicios sin necesidad de API keys:

- ✅ **AlienVault OTX** - API pública
- ✅ **MalwareBazaar** - API pública
- ✅ **ThreatFox** - API pública
- 🔗 **VirusTotal** - Enlace directo (requiere crear cuenta para ver detalles)
- 🔗 **Hybrid Analysis** - Enlace directo

## 📊 Características principales

- 📁 Carga de archivos hasta 50MB
- 🔐 Cálculo de hashes MD5, SHA-1, SHA-256
- 🌐 Consulta automática a múltiples bases de datos
- 🎨 Interfaz responsive con modo oscuro
- ⚡ Sin backend adicional necesario
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
