# 🔧 Instrucciones: Agregar Workflow de Seguridad en GitHub

## ⚠️ Problema Resuelto

El archivo `.github/workflows/security-audit.yml` no pudo ser pusheado debido a restricciones de permisos OAuth (requiere scope 'workflow'). 

**Solución:** Agregar el archivo manualmente en GitHub.

---

## 📝 Pasos para Agregar el Workflow

### Opción 1: Vía Interfaz Web de GitHub (Recomendado)

1. **Ir a tu repositorio en GitHub:**
   ```
   https://github.com/gtamayoc/blog-portfolio
   ```

2. **Navegar a la carpeta de workflows:**
   - Click en `.github/`
   - Click en `workflows/` (si no existe, créala)

3. **Crear nuevo archivo:**
   - Click en "Add file" → "Create new file"
   - Nombre: `security-audit.yml`

4. **Copiar el contenido del archivo local:**
   - Abre: `.github/workflows/security-audit.yml` en tu editor
   - Copia todo el contenido
   - Pégalo en el editor de GitHub

5. **Commit:**
   - Título: `ci: add security audit workflow`
   - Descripción: `Automated security audits, build verification, and Lighthouse CI`
   - Click "Commit new file"

---

### Opción 2: Crear Personal Access Token con Scope 'workflow'

Si prefieres hacer push desde tu máquina local:

1. **Ir a GitHub Settings:**
   ```
   https://github.com/settings/tokens
   ```

2. **Generar nuevo token:**
   - Click "Generate new token" → "Generate new token (classic)"
   - Nombre: `Blog Portfolio - Workflow Access`
   - Scopes a seleccionar:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
   - Expiration: 90 días (o lo que prefieras)
   - Click "Generate token"
   - **⚠️ COPIA EL TOKEN INMEDIATAMENTE** (no lo verás de nuevo)

3. **Actualizar credenciales en Git:**
   ```bash
   # Opción A: Actualizar URL con token
   git remote set-url origin https://TU_TOKEN@github.com/gtamayoc/blog-portfolio.git
   
   # Opción B: Git Credential Manager te pedirá el nuevo token
   git push origin main
   ```

4. **Hacer push del workflow:**
   ```bash
   git add .github/workflows/security-audit.yml
   git commit -m "ci: add security audit workflow"
   git push origin main
   ```

---

## 📄 Contenido del Archivo

El archivo `.github/workflows/security-audit.yml` ya está en tu máquina local en:

```
c:\discolocal\PROYECTOS\NEXT JS\01-BLOG-NEXTJS\blog-portfolio\.github\workflows\security-audit.yml
```

**Contenido completo:**

```yaml
name: Security & Performance Audit

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    # Ejecutar cada lunes a las 9:00 AM UTC
    - cron: '0 9 * * 1'
  workflow_dispatch: # Permitir ejecución manual

jobs:
  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Check for outdated packages
        run: npm outdated || true
      
      - name: Build project
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out/
          retention-days: 7

  lighthouse-audit:
    name: Lighthouse Performance Audit
    runs-on: ubuntu-latest
    needs: security-audit
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/projects
            http://localhost:3000/android
            http://localhost:3000/blog
            http://localhost:3000/about
            http://localhost:3000/contact
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: 3
          configPath: './.lighthouserc.json'
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  bundle-analysis:
    name: Bundle Size Analysis
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and analyze
        run: |
          npm run build
          echo "## Bundle Size Report" >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
          du -sh out/ >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
      
      - name: Comment PR with bundle size
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const output = fs.readFileSync('${{ github.workspace }}/out', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 📦 Bundle Size Report\n\n\`\`\`\n${output}\n\`\`\``
            });
```

---

## ✅ Verificación

Una vez agregado el workflow en GitHub:

1. **Verificar que existe:**
   ```
   https://github.com/gtamayoc/blog-portfolio/blob/main/.github/workflows/security-audit.yml
   ```

2. **Ver ejecuciones:**
   ```
   https://github.com/gtamayoc/blog-portfolio/actions
   ```

3. **Ejecutar manualmente (opcional):**
   - Ir a Actions tab
   - Seleccionar "Security & Performance Audit"
   - Click "Run workflow"

---

## 📊 Estado Actual

✅ **Commit exitoso:** `e00fc3a`  
✅ **Push exitoso:** Código en GitHub  
✅ **Archivos incluidos:** 77 archivos (15,322 líneas)  
⏳ **Pendiente:** Agregar workflow manualmente  

**Archivos ya en GitHub:**
- ✅ Toda la documentación de auditoría (`.agent/`)
- ✅ Dependabot config (`.github/dependabot.yml`)
- ✅ Lighthouse config (`.lighthouserc.json`)
- ✅ Todo el código del proyecto

**Archivo pendiente:**
- ⏳ `.github/workflows/security-audit.yml` (agregar manualmente)

---

## 🎯 Recomendación

**Usa la Opción 1 (Interfaz Web)** - Es más rápida y no requiere configurar tokens.

El workflow comenzará a ejecutarse automáticamente en:
- Cada push a `main`
- Cada Pull Request
- Cada lunes a las 9:00 AM UTC
- Manualmente cuando lo necesites

---

**Siguiente paso:** Una vez agregado el workflow, estará todo listo para comenzar con la implementación de cambios P0. 🚀
