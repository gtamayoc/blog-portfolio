# 🔒 Auditoría de Seguridad y Rendimiento - Portfolio Next.js

**Proyecto:** blog-portfolio  
**Tipo:** Next.js 16.1.1 (App Router) - Static Export  
**Despliegue:** GitHub Pages  
**Fecha de Auditoría:** 2026-01-12  
**Auditor:** Senior Security & Performance Reviewer

---

## 📋 Resumen Ejecutivo

Este documento presenta una auditoría completa de seguridad front-end y rendimiento para el proyecto Next.js estático desplegado en GitHub Pages. Se identificaron **0 vulnerabilidades críticas** en dependencias, pero se encontraron **oportunidades de mejora P0/P1** en headers de seguridad, CSP, optimización de bundles y Core Web Vitals.

### Estado General
- ✅ **Dependencias:** Sin vulnerabilidades conocidas (npm audit clean)
- ⚠️ **CSP:** No implementada (P0)
- ⚠️ **Security Headers:** No configurados para static export (P1)
- ⚠️ **Bundle Size:** Optimizable - Client Components pueden reducirse (P1)
- ✅ **XSS Protection:** Buena - No se detectó `dangerouslySetInnerHTML` en código de aplicación
- ✅ **Secrets:** No se encontraron tokens/keys hardcodeados
- ⚠️ **Third-party Scripts:** Formspree sin estrategia de carga diferida (P2)

---

## 🛡️ CHECKLIST DE SEGURIDAD FRONT-END

### **P0 - Crítico (Implementar Inmediatamente)**

#### ❌ 1. Content Security Policy (CSP) Estricta
**Estado:** No implementada  
**Riesgo:** Alto - Vulnerable a XSS, clickjacking, data injection  
**Impacto:** Sitio estático sin protección contra scripts maliciosos

**Problema:**
- Next.js static export no puede usar `middleware.ts` ni `headers()` en runtime
- GitHub Pages no permite configurar headers HTTP personalizados
- No existe CSP via meta tag

**Solución Recomendada:**
```html
<!-- Agregar en app/(default)/layout.tsx dentro de <head> -->
<meta httpEquiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://formspree.io;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://formspree.io;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self' https://formspree.io;
  object-src 'none';
" />
```

**Nota:** `'unsafe-inline'` y `'unsafe-eval'` son necesarios para Next.js hydration. Para eliminarlos (más seguro), se requiere:
1. Usar nonces dinámicos (no disponible en static export)
2. O migrar a Vercel/Netlify que soportan headers HTTP

---

#### ❌ 2. Security Headers via Meta Tags
**Estado:** Parcialmente implementado  
**Riesgo:** Medio - Falta protección contra clickjacking y MIME sniffing

**Implementar:**
```tsx
// En app/(default)/layout.tsx, agregar en generateMetadata():
export async function generateMetadata() {
  return {
    // ... metadata existente
    other: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  };
}
```

**Limitación:** Estos headers via `metadata` solo funcionan si el servidor los respeta. GitHub Pages **no los respetará**. Alternativa:
- Usar `<meta>` tags directamente en `<head>` para algunos (CSP, viewport)
- Para headers HTTP reales, considerar Cloudflare Pages o Netlify

---

### **P1 - Alto (Implementar en Sprint Actual)**

#### ⚠️ 3. Sanitización de Contenido Dinámico MDX
**Estado:** Bueno - No se usa `dangerouslySetInnerHTML` en código de app  
**Riesgo:** Bajo - MDX content es controlado por el autor

**Hallazgos:**
- ✅ No se encontró `dangerouslySetInnerHTML` en `/app` o `/components`
- ✅ `next-mdx-remote` maneja sanitización automáticamente
- ⚠️ Contenido MDX en `/content` es trusted (autor controla)

**Recomendación:**
- Mantener validación de frontmatter en `lib/mdx.ts`
- Agregar schema validation con Zod para frontmatter:

```typescript
// lib/mdx.ts - Agregar validación
import { z } from 'zod';

const FrontmatterSchema = z.object({
  title: z.string(),
  type: z.enum(['android', 'project', 'blog']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  stack: z.array(z.string()).optional(),
  // ... otros campos
});

export function getPostBySlug(type: string, slug: string) {
  // ... código existente
  const { data, content } = matter(fileContent);
  
  // Validar frontmatter
  try {
    FrontmatterSchema.parse(data);
  } catch (error) {
    console.error(`Invalid frontmatter in ${type}/${slug}:`, error);
    return null;
  }
  
  return { ...data, slug: realSlug, content } as any;
}
```

---

#### ⚠️ 4. Control de Third-Party Scripts
**Estado:** Aceptable - Solo Formspree  
**Riesgo:** Medio - Formspree carga scripts externos sin SRI

**Hallazgos:**
- Formspree API (`https://formspree.io/f/mjggvezp`) usado en `ContactClient.tsx`
- No se usa `next/script` con estrategia de carga
- No hay Subresource Integrity (SRI) checks

**Recomendación:**
```tsx
// ContactClient.tsx - Si Formspree requiere scripts externos
import Script from 'next/script';

export default function ContactClient({ data }: { data: any }) {
  return (
    <>
      {/* Cargar scripts de Formspree con estrategia lazyOnload */}
      <Script
        src="https://formspree.io/js/formbutton-v1.min.js"
        strategy="lazyOnload"
        onLoad={() => console.log('Formspree loaded')}
      />
      
      {/* Resto del componente */}
    </>
  );
}
```

**Nota:** Actualmente Formspree se usa solo via fetch API, no requiere scripts externos. ✅ Buena práctica.

---

#### ⚠️ 5. Manejo de Secretos y Tokens
**Estado:** Excelente - No se encontraron secretos hardcodeados  
**Riesgo:** Muy Bajo

**Hallazgos:**
- ✅ `.env*` está en `.gitignore`
- ✅ No se encontró `process.env` con secrets en código de app
- ✅ Formspree ID (`mjggvezp`) es público (esperado para static sites)
- ✅ No hay API keys de terceros en el código

**Recomendación:**
- Mantener buenas prácticas actuales
- Documentar que Formspree ID es público y no es un secret
- Si se agregan servicios futuros, usar variables de entorno en build time:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_FORMSPREE_ID: process.env.NEXT_PUBLIC_FORMSPREE_ID || 'mjggvezp',
  },
  // ... resto de config
};
```

---

### **P2 - Medio (Backlog)**

#### ✅ 6. Supply Chain Security
**Estado:** Excelente  
**Riesgo:** Muy Bajo

**Hallazgos:**
- ✅ `package-lock.json` presente y actualizado
- ✅ `npm audit` reporta **0 vulnerabilidades**
- ✅ Dependencias actualizadas (Next.js 16.1.1, React 19.2.3)
- ✅ No hay dependencias obsoletas críticas

**Recomendación:**
- Configurar Dependabot en GitHub:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
```

---

#### ⚠️ 7. Input Validation en Formularios
**Estado:** Bueno - Validación básica presente  
**Riesgo:** Bajo

**Hallazgos:**
- ✅ Validación HTML5 (`required`, `type="email"`)
- ✅ Honeypot field (`_gotcha`) para anti-spam
- ✅ Captcha matemático simple
- ⚠️ No hay validación de longitud máxima
- ⚠️ No hay rate limiting (Formspree lo maneja)

**Recomendación:**
```tsx
// ContactClient.tsx - Agregar validación de longitud
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;
  
  // Límites de seguridad
  const maxLengths = {
    name: 100,
    email: 254, // RFC 5321
    subject: 200,
    message: 5000,
  };
  
  if (value.length > maxLengths[id as keyof typeof maxLengths]) {
    return; // Ignorar input excesivo
  }
  
  setFormState(prev => ({ ...prev, [id]: value }));
};
```

---

## ⚡ CHECKLIST DE RENDIMIENTO

### **P0 - Crítico**

#### ⚠️ 1. Reducir JavaScript en Cliente
**Estado:** Mejorable  
**Impacto:** Alto en First Load JS

**Problema:**
- 6 Client Components (`*Client.tsx`) cargan React hooks y estado
- Framer Motion (`framer-motion`) se carga en todos los componentes
- `LazyMotion` configurado pero puede optimizarse más

**Análisis de Bundles (estimado):**
```
Route                          Size     First Load JS
┌ ○ /                          ~15 kB   ~95 kB
├ ○ /about                     ~18 kB   ~98 kB
├ ○ /android                   ~16 kB   ~96 kB
├ ○ /blog                      ~14 kB   ~94 kB
├ ○ /contact                   ~20 kB   ~100 kB (Formspree + Captcha)
└ ○ /projects                  ~16 kB   ~96 kB

First Load JS shared by all:   ~80 kB
  ├ chunks/framework.js         ~45 kB
  ├ chunks/main-app.js          ~25 kB
  └ chunks/page.js              ~10 kB
```

**Solución:**

1. **Lazy load Framer Motion solo donde se usa:**
```tsx
// components/Header.tsx - Ejemplo
'use client';
import { lazy, Suspense } from 'react';

const AnimatedSection = lazy(() => import('./AnimatedSection'));

export function Header() {
  return (
    <header>
      <Suspense fallback={<div>Loading...</div>}>
        <AnimatedSection />
      </Suspense>
    </header>
  );
}
```

2. **Usar `domAnimation` en lugar de `domMax`:**
```tsx
// app/(default)/layout.tsx - YA IMPLEMENTADO ✅
import { LazyMotion, domAnimation } from 'framer-motion';

<LazyMotion features={domAnimation} strict>
  {children}
</LazyMotion>
```

3. **Convertir componentes estáticos a Server Components:**
```tsx
// components/Footer.tsx - PUEDE SER SERVER COMPONENT
// Remover 'use client' si no usa hooks

export function Footer({ data }: { data: any }) {
  // No usa useState, useEffect - puede ser Server Component
  return <footer>...</footer>;
}
```

---

#### ⚠️ 2. Code Splitting y Dynamic Imports
**Estado:** Básico - Next.js automático  
**Impacto:** Medio

**Recomendación:**
```tsx
// app/(default)/contact/page.tsx
import dynamic from 'next/dynamic';

const ContactClient = dynamic(() => import('./ContactClient'), {
  loading: () => <div className="min-h-screen bg-page animate-pulse" />,
  ssr: false, // Formulario no necesita SSR
});

export default async function ContactPage() {
  const globalData = getGlobalData();
  return <ContactClient data={globalData} />;
}
```

---

### **P1 - Alto**

#### ⚠️ 3. Optimización de Imágenes
**Estado:** Configurado para static export  
**Impacto:** Alto en LCP

**Configuración Actual:**
```typescript
// next.config.ts
images: {
  unoptimized: true, // Requerido para static export
}
```

**Problema:**
- `unoptimized: true` desactiva optimización automática de Next.js
- Imágenes se sirven en tamaño original
- No hay lazy loading automático

**Solución:**

1. **Pre-optimizar imágenes antes del build:**
```json
// package.json - Agregar script
{
  "scripts": {
    "optimize-images": "sharp-cli --input public/**/*.{jpg,png} --output public/ --format webp",
    "prebuild": "npm run optimize-images"
  }
}
```

2. **Usar componente Image con loading="lazy":**
```tsx
// components/Image.tsx - MEJORAR
import NextImage from 'next/image';

export function Image({ src, alt, ...props }: any) {
  return (
    <NextImage
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..." // Generar blur placeholder
      {...props}
    />
  );
}
```

3. **Implementar responsive images:**
```tsx
<Image
  src="/projects/pos-qr.jpg"
  alt="POS QR Module"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

#### ⚠️ 4. Optimización de Fuentes
**Estado:** Bueno - Google Fonts con `next/font`  
**Impacto:** Medio en CLS

**Configuración Actual:**
```typescript
// app/(default)/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

**Mejora:**
```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Evitar FOIT (Flash of Invisible Text)
  preload: true,
  fallback: ['system-ui', 'arial'], // Fallback fonts
});
```

---

#### ⚠️ 5. Reducir Unused CSS
**Estado:** Bueno - Tailwind CSS con purge  
**Impacto:** Bajo

**Configuración Actual:**
```css
/* app/globals.css */
@import "tailwindcss";
```

**Verificar que Tailwind purge funciona:**
```javascript
// tailwind.config.js (si existe)
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  // ...
};
```

---

### **P2 - Medio**

#### ⚠️ 6. Core Web Vitals - LCP (Largest Contentful Paint)
**Target:** < 2.5s  
**Estimado Actual:** ~3.5s (sin optimización de imágenes)

**Mejoras:**
1. Pre-cargar imagen hero:
```tsx
// app/(default)/page.tsx
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/hero-image.webp" />
      </Head>
      {/* ... */}
    </>
  );
}
```

2. Usar `priority` en imagen hero:
```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  priority // Carga inmediata
  width={1200}
  height={800}
/>
```

---

#### ⚠️ 7. Core Web Vitals - CLS (Cumulative Layout Shift)
**Target:** < 0.1  
**Estimado Actual:** ~0.05 (Bueno)

**Hallazgos:**
- ✅ Fuentes con `font-display: swap`
- ✅ Dimensiones de imágenes especificadas
- ⚠️ Componentes con `mounted` state pueden causar shift

**Mejora:**
```tsx
// *Client.tsx - Evitar layout shift en hydration
const [mounted, setMounted] = useState(false);

if (!mounted) {
  // Renderizar skeleton con mismas dimensiones que contenido final
  return <div className="min-h-screen bg-page" />;
}
```

---

#### ⚠️ 8. Core Web Vitals - FID/INP (Interactividad)
**Target FID:** < 100ms  
**Target INP:** < 200ms  
**Estimado Actual:** ~150ms (Aceptable)

**Mejoras:**
1. Debounce en inputs:
```tsx
// ContactClient.tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedChange = useDebouncedCallback(
  (id: string, value: string) => {
    setFormState(prev => ({ ...prev, [id]: value }));
  },
  300
);
```

2. Usar `useTransition` para updates no urgentes:
```tsx
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();

const handleFilter = (value: string) => {
  startTransition(() => {
    setFilter(value); // Update no urgente
  });
};
```

---

## 🔧 CAMBIOS CONCRETOS RECOMENDADOS

### 1. `next.config.ts` - Security Headers

```diff
import type { NextConfig } from "next";

const repo = 'blog-portfolio';

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
+  // Nota: Headers no funcionan en static export, usar meta tags
+  // async headers() {
+  //   return [
+  //     {
+  //       source: '/:path*',
+  //       headers: [
+  //         { key: 'X-Frame-Options', value: 'DENY' },
+  //         { key: 'X-Content-Type-Options', value: 'nosniff' },
+  //         { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
+  //       ],
+  //     },
+  //   ];
+  // },
};

export default nextConfig;
```

---

### 2. `app/(default)/layout.tsx` - CSP y Meta Tags

```diff
export async function generateMetadata() {
  const globalData = getGlobalData();
  const name = globalData?.name || "Giuseppe Tamayo C.";
  return {
    title: `${name} | Portfolio`,
    description: `Full Stack Developer Portfolio`,
+    metadataBase: new URL('https://gtamayoc.github.io/blog-portfolio'),
+    robots: {
+      index: true,
+      follow: true,
+    },
    other: {
      "format-detection": "telephone=no, date=no, email=no, address=no",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = getGlobalData();

  return (
    <html lang="es" suppressHydrationWarning>
-     <head suppressHydrationWarning />
+     <head suppressHydrationWarning>
+       {/* Content Security Policy */}
+       <meta httpEquiv="Content-Security-Policy" content="
+         default-src 'self';
+         script-src 'self' 'unsafe-inline' 'unsafe-eval' https://formspree.io;
+         style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
+         font-src 'self' https://fonts.gstatic.com;
+         img-src 'self' data: https:;
+         connect-src 'self' https://formspree.io;
+         frame-ancestors 'none';
+         base-uri 'self';
+         form-action 'self' https://formspree.io;
+         object-src 'none';
+       " />
+       
+       {/* Security Headers (limitado en static export) */}
+       <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
+       <meta name="referrer" content="strict-origin-when-cross-origin" />
+     </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
        data-bitwarden-no-filtering="true"
      >
        {/* ... resto del código */}
      </body>
    </html>
  );
}
```

---

### 3. `components/Footer.tsx` - Convertir a Server Component

```diff
-"use client";
-
-import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Twitter, CirclePlay } from "lucide-react";

export function Footer({ data }: { data: any }) {
  const t = useTranslations("Common");
  const tSocials = useTranslations("Socials");
-  const [mounted, setMounted] = useState(false);
-
-  useEffect(() => {
-    setMounted(true);
-  }, []);

  const currentYear = new Date().getFullYear();

  if (!data) return null;
-  if (!mounted) return <footer className="max-w-6xl mx-auto px-4 py-12" />;

  const { socials, footer } = data;
  const copyText = footer?.copy_es || t("footerCopy");

  return (
-    <footer className="max-w-6xl mx-auto px-4 py-12" suppressHydrationWarning>
+    <footer className="max-w-6xl mx-auto px-4 py-12">
      {/* ... resto del código sin suppressHydrationWarning */}
    </footer>
  );
}
```

**Nota:** Si `useTranslations` requiere client-side, mantener como Client Component pero optimizar.

---

### 4. `app/(default)/contact/page.tsx` - Dynamic Import

```diff
+import dynamic from 'next/dynamic';
import { getGlobalData } from "@/lib/mdx";
-import ContactClient from "./ContactClient";

+const ContactClient = dynamic(() => import('./ContactClient'), {
+  loading: () => (
+    <div className="min-h-screen bg-page flex items-center justify-center">
+      <div className="animate-pulse text-text-secondary">Cargando formulario...</div>
+    </div>
+  ),
+  ssr: false, // Formulario no necesita SSR
+});

export default async function ContactPage() {
  const globalData = getGlobalData();
  return <ContactClient data={globalData} />;
}
```

---

### 5. `lib/mdx.ts` - Validación de Frontmatter

```diff
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFallbackContent } from "./content/resolver";
+import { z } from "zod";

const root = process.cwd();

+// Schema de validación para frontmatter
+const BaseFrontmatterSchema = z.object({
+  title: z.string().max(200),
+  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
+  type: z.enum(['android', 'project', 'blog', 'page']).optional(),
+});

export function getPostBySlug(type: string, slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const filePath = path.join(root, "content", type, `${realSlug}.mdx`);

  if (!fs.existsSync(filePath)) {
    const fallback = getFallbackContent(type, slug);
    if (fallback) {
      return { ...fallback, slug: realSlug };
    }
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

+  // Validar frontmatter para prevenir inyección
+  try {
+    BaseFrontmatterSchema.parse(data);
+  } catch (error) {
+    console.error(`❌ Invalid frontmatter in ${type}/${slug}:`, error);
+    return null;
+  }

  return { ...data, slug: realSlug, content } as any;
}
```

---

### 6. `components/Image.tsx` - Optimización

```diff
import NextImage from "next/image";

export function Image({ src, alt, ...props }: any) {
+  // Generar blur placeholder para mejor UX
+  const shimmer = (w: number, h: number) => `
+    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
+      <rect width="${w}" height="${h}" fill="#f3f4f6"/>
+    </svg>
+  `;
+  
+  const toBase64 = (str: string) =>
+    typeof window === 'undefined'
+      ? Buffer.from(str).toString('base64')
+      : window.btoa(str);

  return (
    <NextImage
      src={src}
      alt={alt}
+      loading="lazy"
+      placeholder="blur"
+      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      {...props}
    />
  );
}
```

---

## 📐 REGLAS DE ARQUITECTURA

### 1. Separación de Responsabilidades

```
/app                    → Routing y Server Components
  /(default)
    /page.tsx           → Server Component (fetch data)
    /*Client.tsx        → Client Component (UI + interacción)

/components             → Componentes reutilizables
  /Header.tsx           → Puede ser Server Component si no usa hooks
  /Footer.tsx           → Puede ser Server Component
  /MDXContent.tsx       → Server Component (renderiza MDX)

/lib                    → Lógica de negocio y utilidades
  /mdx.ts               → Server-only (usa fs)
  /utils.ts             → Compartido (sin dependencias de Node)
  /content/resolver.ts  → Server-only
```

### 2. Convenciones de Imports

```typescript
// ✅ Correcto - Imports organizados
import type { Metadata } from "next";           // Types primero
import { getGlobalData } from "@/lib/mdx";      // Server utilities
import { Header } from "@/components/Header";   // Components
import "../globals.css";                        // Styles al final

// ❌ Incorrecto - Imports desordenados
import "../globals.css";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
```

### 3. Límites Server/Client Components

**Server Components (por defecto):**
- Páginas que solo renderizan datos
- Componentes que usan `fs`, `path`, `gray-matter`
- Layouts que no necesitan interactividad

**Client Components (`"use client"`):**
- Componentes con `useState`, `useEffect`, `useContext`
- Event handlers (`onClick`, `onChange`)
- Componentes que usan browser APIs

**Regla de Oro:**
> Mantener Client Components lo más pequeños posible. Extraer lógica de presentación a Server Components cuando sea posible.

```tsx
// ✅ Bueno - Server Component wrapper
// app/(default)/projects/page.tsx
import ProjectsClient from './ProjectsClient';
import { getAllPosts } from '@/lib/mdx';

export default async function ProjectsPage() {
  const projects = getAllPosts('projects'); // Server-side
  return <ProjectsClient projects={projects} />; // Client-side UI
}

// ❌ Malo - Todo en Client Component
'use client';
import { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // ❌ No se puede usar fs en client
    fetch('/api/projects').then(/* ... */);
  }, []);
}
```

### 4. Gestión de Estado

**Estado Local:**
```tsx
// ✅ Usar useState para UI state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

**Estado Global (si se necesita):**
```tsx
// Usar React Context solo cuando sea necesario
// Evitar prop drilling excesivo

// contexts/ThemeContext.tsx
'use client';
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // ...
}
```

**Estado de Servidor:**
```tsx
// ✅ Pasar datos via props desde Server Components
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <ClientComponent data={data} />;
}
```

---

## 🧪 PLAN DE PRUEBAS

### 1. Lighthouse Audit

**Ejecutar:**
```bash
# Opción 1: Chrome DevTools
# 1. Abrir https://gtamayoc.github.io/blog-portfolio en Chrome
# 2. F12 → Lighthouse tab
# 3. Seleccionar: Performance, Accessibility, Best Practices, SEO
# 4. Click "Analyze page load"

# Opción 2: CLI
npm install -g @lhci/cli
lhci autorun --collect.url=https://gtamayoc.github.io/blog-portfolio
```

**Métricas Objetivo:**
- **Performance:** ≥ 90
- **Accessibility:** ≥ 95
- **Best Practices:** ≥ 90
- **SEO:** ≥ 95

**Páginas a Auditar:**
- `/` (Home)
- `/projects`
- `/android`
- `/blog`
- `/about`
- `/contact`

---

### 2. Verificación de CSP

**Herramienta:** [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

**Pasos:**
1. Desplegar cambios de CSP
2. Inspeccionar headers en DevTools → Network → Headers
3. Copiar CSP policy
4. Pegar en CSP Evaluator
5. Verificar que no haya warnings críticos

**Test Manual:**
```javascript
// En DevTools Console, verificar que estos fallen:
eval('alert("XSS")'); // ❌ Debe fallar con CSP
document.write('<script>alert("XSS")</script>'); // ❌ Debe fallar
```

---

### 3. Pipeline CI con Auditoría de Dependencias

**Crear `.github/workflows/security-audit.yml`:**

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Lunes a medianoche

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Check for outdated packages
        run: npm outdated || true
      
      - name: Build project
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://gtamayoc.github.io/blog-portfolio
            https://gtamayoc.github.io/blog-portfolio/projects
            https://gtamayoc.github.io/blog-portfolio/contact
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

### 4. Pruebas de Rendimiento

**WebPageTest:**
```
URL: https://www.webpagetest.org/
Test URL: https://gtamayoc.github.io/blog-portfolio
Location: Dulles, VA (USA)
Browser: Chrome
Connection: Cable
```

**Métricas a Monitorear:**
- **TTFB (Time to First Byte):** < 600ms
- **FCP (First Contentful Paint):** < 1.8s
- **LCP (Largest Contentful Paint):** < 2.5s
- **TBT (Total Blocking Time):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

### 5. Pruebas de Seguridad

**Security Headers:**
```bash
# Usar securityheaders.com
curl -I https://gtamayoc.github.io/blog-portfolio

# Verificar headers presentes:
# - Content-Security-Policy
# - X-Content-Type-Options
# - Referrer-Policy
```

**OWASP ZAP Scan:**
```bash
# Instalar OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://gtamayoc.github.io/blog-portfolio \
  -r zap-report.html
```

---

## 📊 MÉTRICAS DE ÉXITO

### Pre-Optimización (Estimado Actual)

| Métrica | Valor Actual | Objetivo | Estado |
|---------|--------------|----------|--------|
| Lighthouse Performance | ~75 | ≥90 | ⚠️ |
| First Load JS | ~100 kB | <85 kB | ⚠️ |
| LCP | ~3.5s | <2.5s | ❌ |
| CLS | ~0.05 | <0.1 | ✅ |
| FID | ~150ms | <100ms | ⚠️ |
| npm audit vulnerabilities | 0 | 0 | ✅ |
| CSP Coverage | 0% | 100% | ❌ |
| Security Headers | 20% | 80% | ❌ |

### Post-Optimización (Objetivo)

| Métrica | Valor Objetivo | Plazo |
|---------|----------------|-------|
| Lighthouse Performance | ≥92 | Sprint 1 |
| First Load JS | <80 kB | Sprint 1 |
| LCP | <2.0s | Sprint 2 |
| CLS | <0.05 | Sprint 1 |
| FID | <80ms | Sprint 2 |
| CSP Coverage | 100% | Sprint 1 |
| Security Headers | 90% | Sprint 1 |

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### Sprint 1 (Semana 1-2) - P0 + P1 Crítico

**Día 1-2:**
- [ ] Implementar CSP via meta tags en `layout.tsx`
- [ ] Agregar security headers en metadata
- [ ] Validar que no rompa funcionalidad existente

**Día 3-4:**
- [ ] Convertir `Footer.tsx` a Server Component
- [ ] Implementar dynamic imports en páginas pesadas
- [ ] Optimizar Framer Motion con lazy loading

**Día 5-7:**
- [ ] Agregar validación de frontmatter con Zod
- [ ] Implementar blur placeholders en imágenes
- [ ] Configurar Lighthouse CI en GitHub Actions

**Día 8-10:**
- [ ] Ejecutar auditoría completa de Lighthouse
- [ ] Corregir issues encontrados
- [ ] Documentar resultados

---

### Sprint 2 (Semana 3-4) - P1 + P2

**Día 1-3:**
- [ ] Optimizar imágenes (WebP, responsive)
- [ ] Implementar preload de recursos críticos
- [ ] Mejorar font loading strategy

**Día 4-6:**
- [ ] Configurar Dependabot
- [ ] Implementar rate limiting en formulario (si aplica)
- [ ] Agregar validación de longitud en inputs

**Día 7-10:**
- [ ] Ejecutar WebPageTest y analizar resultados
- [ ] Ejecutar OWASP ZAP scan
- [ ] Documentar hallazgos y crear backlog

---

## 📝 CONCLUSIONES Y RECOMENDACIONES

### Fortalezas del Proyecto Actual

1. ✅ **Arquitectura Sólida:** Separación clara entre Server/Client Components
2. ✅ **Sin Vulnerabilidades:** npm audit clean, dependencias actualizadas
3. ✅ **Buenas Prácticas:** No uso de `dangerouslySetInnerHTML`, secrets bien manejados
4. ✅ **Static Export:** Compatible con GitHub Pages sin backend
5. ✅ **TypeScript:** Type safety en todo el proyecto

### Áreas de Mejora Prioritarias

1. ⚠️ **CSP (P0):** Implementar Content Security Policy estricta
2. ⚠️ **Bundle Size (P0):** Reducir First Load JS de ~100kB a <85kB
3. ⚠️ **Imágenes (P1):** Optimizar formato y lazy loading
4. ⚠️ **Security Headers (P1):** Agregar headers via meta tags (limitación de GitHub Pages)

### Limitaciones de GitHub Pages

**No Soporta:**
- Headers HTTP personalizados (CSP, HSTS, etc.)
- Server-side rendering dinámico
- API routes
- Middleware

**Alternativas Recomendadas (Futuro):**
- **Cloudflare Pages:** Soporta headers HTTP, edge functions
- **Netlify:** Headers, redirects, edge functions
- **Vercel:** Full Next.js support, ISR, middleware

### Recomendación Final

**Para Producción Inmediata:**
1. Implementar CSP via `<meta>` tags (P0)
2. Optimizar bundles con dynamic imports (P0)
3. Configurar CI/CD con Lighthouse (P1)

**Para Migración Futura (Opcional):**
- Considerar Cloudflare Pages o Netlify para headers HTTP reales
- Habilitar ISR (Incremental Static Regeneration) para blog
- Implementar edge functions para formulario (eliminar Formspree)

---

**Auditoría completada por:** Senior Security & Performance Reviewer  
**Próxima revisión:** Post-implementación Sprint 1 (2 semanas)  
**Contacto:** Disponible para aclaraciones y seguimiento

---

## 📚 REFERENCIAS

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web.dev Performance](https://web.dev/performance/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
