# 🚀 Configuración de GitHub Pages para Next.js

## 🔍 Problema Identificado

GitHub Pages intentó construir tu sitio con **Jekyll** (generador por defecto), pero tu proyecto es **Next.js**.

**Error:**
```
No such file or directory @ dir_chdir0 - /github/workspace/docs
```

**Causa:** GitHub Pages buscaba carpeta `/docs` (Jekyll) en lugar de `/out` (Next.js).

---

## ✅ Solución Implementada

### 1. Workflow de Despliegue Next.js

Creado: `.github/workflows/nextjs-deploy.yml`

**Qué hace:**
- ✅ Instala dependencias con `npm ci`
- ✅ Construye el proyecto con `npm run build`
- ✅ Sube la carpeta `/out` a GitHub Pages
- ✅ Despliega automáticamente

### 2. Desactivar Jekyll

Creado: `public/.nojekyll`

**Qué hace:**
- ✅ Le dice a GitHub Pages que NO use Jekyll
- ✅ Sirve archivos estáticos directamente

---

## 📝 Pasos para Completar la Configuración

### Paso 1: Configurar GitHub Pages en el Repositorio

1. **Ir a Settings:**
   ```
   https://github.com/gtamayoc/blog-portfolio/settings/pages
   ```

2. **Configurar Source:**
   - **Source:** GitHub Actions (no "Deploy from a branch")
   - Debería verse así:
     ```
     Source: GitHub Actions
     ```

3. **Guardar cambios**

### Paso 2: Subir los Archivos Nuevos

```bash
# Agregar archivos
git add .github/workflows/nextjs-deploy.yml
git add public/.nojekyll

# Commit
git commit -m "ci: configure GitHub Pages deployment for Next.js"

# Push
git push origin main
```

### Paso 3: Verificar Despliegue

1. **Ver Actions:**
   ```
   https://github.com/gtamayoc/blog-portfolio/actions
   ```

2. **Esperar a que termine:**
   - ✅ Build (2-3 min)
   - ✅ Deploy (30 seg)

3. **Visitar sitio:**
   ```
   https://gtamayoc.github.io/blog-portfolio
   ```

---

## 🔧 Configuración Actual vs. Necesaria

### ❌ Configuración Anterior (Incorrecta)

```yaml
# GitHub Pages intentaba usar Jekyll automáticamente
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

**Resultado:** Error porque no hay archivos Jekyll

### ✅ Configuración Nueva (Correcta)

```yaml
# GitHub Pages usa workflow personalizado
Source: GitHub Actions
Workflow: nextjs-deploy.yml
Output: /out folder
```

**Resultado:** Despliegue exitoso de Next.js

---

## 📊 Flujo de Despliegue

```
Push a main
    ↓
Trigger: nextjs-deploy.yml
    ↓
Job: Build
  ├─ Checkout código
  ├─ Setup Node.js 20
  ├─ npm ci (instalar deps)
  ├─ npm run build (generar /out)
  └─ Upload /out como artifact
    ↓
Job: Deploy
  ├─ Download artifact
  └─ Deploy to GitHub Pages
    ↓
Sitio disponible en:
https://gtamayoc.github.io/blog-portfolio
```

---

## 🎯 Verificación Post-Despliegue

### Checklist

- [ ] Workflow `nextjs-deploy.yml` agregado
- [ ] Archivo `.nojekyll` agregado
- [ ] GitHub Pages configurado con "GitHub Actions"
- [ ] Push realizado
- [ ] Workflow ejecutado exitosamente
- [ ] Sitio accesible en URL

### Comandos de Verificación

```bash
# Ver status de archivos
git status

# Ver workflows disponibles
ls -la .github/workflows/

# Ver archivo .nojekyll
ls -la public/.nojekyll
```

---

## 🐛 Troubleshooting

### Problema: Workflow no se ejecuta

**Solución:**
1. Verificar que GitHub Pages esté configurado con "GitHub Actions"
2. Verificar que el archivo esté en `.github/workflows/nextjs-deploy.yml`
3. Hacer push a `main`

### Problema: Build falla

**Solución:**
```bash
# Probar build localmente
npm run build

# Si falla, revisar errores
# Si funciona, el problema es de configuración
```

### Problema: Sitio muestra 404

**Solución:**
1. Verificar `basePath` en `next.config.ts`:
   ```typescript
   basePath: '/blog-portfolio'
   ```
2. Verificar que `/out` se generó correctamente
3. Verificar que `.nojekyll` existe en `/out`

### Problema: CSS/JS no cargan

**Solución:**
Verificar `assetPrefix` en `next.config.ts`:
```typescript
assetPrefix: '/blog-portfolio/'
```

---

## 📁 Archivos Creados

### `.github/workflows/nextjs-deploy.yml`

```yaml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    # ... (ver archivo completo)
  
  deploy:
    # ... (ver archivo completo)
```

### `public/.nojekyll`

```
(archivo vacío)
```

**Propósito:** Desactiva Jekyll en GitHub Pages

---

## 🎓 Explicación Técnica

### ¿Por qué GitHub Pages usaba Jekyll?

**Respuesta:** Por defecto, GitHub Pages asume que cualquier repositorio sin configuración específica es un sitio Jekyll.

**Detección automática:**
- Si encuentra `_config.yml` → Jekyll
- Si encuentra `Gemfile` → Jekyll
- Si no encuentra nada → Intenta Jekyll de todas formas

### ¿Qué hace `.nojekyll`?

**Respuesta:** Es un archivo especial que le dice a GitHub Pages:

```
"No proceses este sitio con Jekyll.
Sirve los archivos estáticos directamente."
```

**Sin `.nojekyll`:**
```
GitHub Pages → Busca _config.yml
             → No encuentra
             → Intenta construir con Jekyll
             → Falla
```

**Con `.nojekyll`:**
```
GitHub Pages → Ve .nojekyll
             → Sirve archivos directamente
             → Éxito
```

### ¿Por qué usar GitHub Actions?

**Respuesta:** Porque Next.js requiere un proceso de build:

```
Código fuente (app/, components/, etc.)
         ↓
    npm run build
         ↓
  Archivos estáticos (/out)
         ↓
    GitHub Pages
```

**Jekyll (antiguo):**
- ❌ No puede ejecutar `npm run build`
- ❌ No entiende Next.js

**GitHub Actions (nuevo):**
- ✅ Ejecuta `npm run build`
- ✅ Sube `/out` a GitHub Pages
- ✅ Funciona con cualquier generador

---

## 🚀 Próximos Pasos

1. **Configurar GitHub Pages:**
   - Settings → Pages → Source: GitHub Actions

2. **Subir archivos:**
   ```bash
   git add .github/workflows/nextjs-deploy.yml public/.nojekyll
   git commit -m "ci: configure GitHub Pages deployment for Next.js"
   git push origin main
   ```

3. **Esperar despliegue:**
   - Ver en: https://github.com/gtamayoc/blog-portfolio/actions

4. **Visitar sitio:**
   - https://gtamayoc.github.io/blog-portfolio

---

## ✅ Resumen

| Antes | Después |
|-------|---------|
| ❌ Jekyll automático | ✅ Next.js con workflow |
| ❌ Busca `/docs` | ✅ Usa `/out` |
| ❌ Error de build | ✅ Build exitoso |
| ❌ Sitio no disponible | ✅ Sitio desplegado |

**Tiempo estimado:** 5 minutos para configurar + 3 minutos de build/deploy

---

**¿Necesitas ayuda con algún paso específico?** 🚀
