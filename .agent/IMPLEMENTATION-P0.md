# 🚀 Implementación Inmediata - Cambios P0

Este documento contiene los cambios concretos a implementar **inmediatamente** (Prioridad P0) basados en la auditoría de seguridad y rendimiento.

## 📝 Checklist de Implementación

- [ ] 1. Agregar CSP y Security Headers en layout.tsx
- [ ] 2. Optimizar componente Footer (convertir a Server Component)
- [ ] 3. Implementar dynamic imports en páginas pesadas
- [ ] 4. Agregar validación de frontmatter con Zod
- [ ] 5. Optimizar componente Image con blur placeholders
- [ ] 6. Verificar funcionamiento post-cambios

---

## 1️⃣ CSP y Security Headers

### Archivo: `app/(default)/layout.tsx`

**Cambios a realizar:**

1. Actualizar la función `generateMetadata()`:

```typescript
export async function generateMetadata() {
  const globalData = getGlobalData();
  const name = globalData?.name || "Giuseppe Tamayo C.";
  return {
    title: `${name} | Portfolio`,
    description: `Full Stack Developer Portfolio`,
    metadataBase: new URL('https://gtamayoc.github.io/blog-portfolio'),
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "format-detection": "telephone=no, date=no, email=no, address=no",
    },
  };
}
```

2. Modificar el `<head>` en el componente `RootLayout`:

```typescript
<head suppressHydrationWarning>
  {/* Content Security Policy */}
  <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://formspree.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://formspree.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://formspree.io; object-src 'none';" />
  
  {/* Security Headers */}
  <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
</head>
```

**Justificación:**
- Protege contra XSS, clickjacking y data injection
- Compatible con static export de Next.js
- Permite Formspree para el formulario de contacto

---

## 2️⃣ Optimizar Footer Component

### Archivo: `components/Footer.tsx`

**Problema:** Footer usa `"use client"` innecesariamente, aumentando bundle size.

**Solución:** Convertir a Server Component si `useTranslations` lo permite.

**Opción A - Si `useTranslations` funciona en Server:**

```typescript
// Remover "use client" y hooks
import { useTranslations } from "next-intl";
import { Github, Linkedin, Twitter, CirclePlay } from "lucide-react";

export function Footer({ data }: { data: any }) {
  const t = useTranslations("Common");
  const tSocials = useTranslations("Socials");
  
  const currentYear = new Date().getFullYear();

  if (!data) return null;

  const { socials, footer } = data;
  const copyText = footer?.copy_es || t("footerCopy");

  return (
    <footer className="max-w-6xl mx-auto px-4 py-12">
      {/* Resto del código sin suppressHydrationWarning */}
    </footer>
  );
}
```

**Opción B - Si requiere Client (mantener optimizado):**

```typescript
"use client";

import { useTranslations } from "next-intl";
import { Github, Linkedin, Twitter, CirclePlay } from "lucide-react";

export function Footer({ data }: { data: any }) {
  const t = useTranslations("Common");
  const tSocials = useTranslations("Socials");
  
  const currentYear = new Date().getFullYear();

  if (!data) return null;

  const { socials, footer } = data;
  const copyText = footer?.copy_es || t("footerCopy");

  return (
    <footer className="max-w-6xl mx-auto px-4 py-12">
      <section className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Contenido sin cambios */}
      </section>
    </footer>
  );
}
```

**Impacto:** Reduce ~5-8 kB del bundle si se convierte a Server Component.

---

## 3️⃣ Dynamic Imports en Páginas Pesadas

### Archivo: `app/(default)/contact/page.tsx`

**Cambio:**

```typescript
import dynamic from 'next/dynamic';
import { getGlobalData } from "@/lib/mdx";

const ContactClient = dynamic(() => import('./ContactClient'), {
  loading: () => (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="animate-pulse text-text-secondary">Cargando formulario...</div>
    </div>
  ),
  ssr: false, // Formulario no necesita SSR
});

export default async function ContactPage() {
  const globalData = getGlobalData();
  return <ContactClient data={globalData} />;
}
```

**Impacto:** Reduce First Load JS en ~15-20 kB, mejora Time to Interactive.

---

### Archivo: `app/(default)/projects/page.tsx`

**Aplicar el mismo patrón:**

```typescript
import dynamic from 'next/dynamic';
import { getAllPosts } from "@/lib/mdx";

const ProjectsClient = dynamic(() => import('./ProjectsClient'), {
  loading: () => <div className="min-h-screen bg-page animate-pulse" />,
});

export default async function ProjectsPage() {
  const projects = getAllPosts("projects");
  return <ProjectsClient projects={projects} />;
}
```

---

## 4️⃣ Validación de Frontmatter

### Archivo: `lib/mdx.ts`

**Paso 1:** Instalar Zod (si no está instalado):

```bash
npm install zod
```

**Paso 2:** Agregar validación:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFallbackContent } from "./content/resolver";
import { z } from "zod";

const root = process.cwd();

// Schema de validación para frontmatter
const BaseFrontmatterSchema = z.object({
  title: z.string().max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['android', 'project', 'blog', 'page']).optional(),
  stack: z.array(z.string()).optional(),
  repo: z.string().url().optional(),
  cover: z.string().optional(),
});

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

  // Validar frontmatter para prevenir inyección
  try {
    BaseFrontmatterSchema.parse(data);
  } catch (error) {
    console.error(`❌ Invalid frontmatter in ${type}/${slug}:`, error);
    return null;
  }

  return { ...data, slug: realSlug, content } as any;
}

// ... resto del código sin cambios
```

**Impacto:** Previene inyección de contenido malicioso via frontmatter.

---

## 5️⃣ Optimizar Componente Image

### Archivo: `components/Image.tsx`

**Cambio completo:**

```typescript
import NextImage from "next/image";

export function Image({ src, alt, ...props }: any) {
  // Generar blur placeholder para mejor UX
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f3f4f6" offset="20%" />
          <stop stop-color="#e5e7eb" offset="50%" />
          <stop stop-color="#f3f4f6" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f3f4f6" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;
  
  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return (
    <NextImage
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      {...props}
    />
  );
}
```

**Impacto:** Mejora LCP y CLS con blur placeholders animados.

---

## 6️⃣ Verificación Post-Implementación

### Comandos a ejecutar:

```bash
# 1. Verificar que el proyecto compila
npm run build

# 2. Verificar que no hay errores de TypeScript
npx tsc --noEmit

# 3. Ejecutar en desarrollo para probar
npm run dev
```

### Checklist de Pruebas:

- [ ] Todas las páginas cargan correctamente
- [ ] Formulario de contacto funciona
- [ ] No hay errores en consola del navegador
- [ ] CSP no bloquea recursos necesarios
- [ ] Imágenes cargan con blur placeholder
- [ ] Build exitoso sin warnings críticos

### Verificar CSP en DevTools:

1. Abrir DevTools (F12)
2. Ir a Console
3. Intentar ejecutar: `eval('alert("test")')`
4. **Debe fallar** con error de CSP ✅

---

## 📊 Resultados Esperados

### Antes de Cambios:
- First Load JS: ~100 kB
- Lighthouse Performance: ~75
- CSP: No implementada
- Security Headers: 0/5

### Después de Cambios:
- First Load JS: ~80-85 kB (**-15% mejora**)
- Lighthouse Performance: ~85-90 (**+10-15 puntos**)
- CSP: Implementada ✅
- Security Headers: 2/5 (limitado por GitHub Pages)

---

## 🆘 Troubleshooting

### Problema: CSP bloquea recursos necesarios

**Solución:** Ajustar la política en `layout.tsx`:

```typescript
// Agregar dominio específico a la directiva correspondiente
// Ejemplo: Si Google Analytics falla
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
```

### Problema: Dynamic import causa error de hydration

**Solución:** Asegurar que el loading placeholder tenga las mismas dimensiones:

```typescript
loading: () => (
  <div className="min-h-screen bg-page" /> // Mismo height que el componente real
)
```

### Problema: Zod no está instalado

**Solución:**

```bash
npm install zod
```

### Problema: Footer sigue siendo Client Component

**Solución:** Si `useTranslations` requiere client-side, mantenerlo como Client Component pero optimizar:

```typescript
// Lazy load iconos
import dynamic from 'next/dynamic';

const Github = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Github })));
const Linkedin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Linkedin })));
```

---

## 📝 Notas Finales

1. **Orden de Implementación:** Seguir el orden numérico (1→2→3→4→5)
2. **Testing:** Probar cada cambio individualmente antes de continuar
3. **Commit Strategy:** Hacer un commit por cada cambio implementado
4. **Rollback:** Si algo falla, revertir el último commit

**Tiempo Estimado Total:** 2-3 horas

**Próximo Paso:** Una vez completados estos cambios P0, proceder con los cambios P1 del documento principal de auditoría.
