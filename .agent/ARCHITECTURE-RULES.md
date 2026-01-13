# 🏗️ Reglas de Arquitectura - Next.js Portfolio

Este documento define las reglas y convenciones de arquitectura para mantener la calidad, seguridad y rendimiento del proyecto.

---

## 📁 Estructura de Directorios

```
blog-portfolio/
├── .agent/                     # Documentación y workflows del agente
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   └── dependabot.yml          # Configuración de Dependabot
├── app/                        # Next.js App Router
│   ├── (default)/              # Grupo de rutas principal
│   │   ├── layout.tsx          # Layout raíz (Server Component)
│   │   ├── page.tsx            # Home page (Server Component)
│   │   ├── HomeClient.tsx      # Home UI (Client Component)
│   │   ├── about/
│   │   │   ├── page.tsx        # Server Component (fetch data)
│   │   │   └── AboutClient.tsx # Client Component (UI + interacción)
│   │   └── ...
│   ├── globals.css             # Estilos globales
│   └── favicon.ico
├── components/                 # Componentes reutilizables
│   ├── Header.tsx              # Navegación (puede ser Server/Client)
│   ├── Footer.tsx              # Footer (preferir Server Component)
│   ├── MDXContent.tsx          # Renderizador MDX (Server Component)
│   ├── Image.tsx               # Wrapper de next/image
│   └── ...
├── content/                    # Contenido MDX
│   ├── projects/
│   ├── android/
│   ├── blog/
│   └── pages/
├── lib/                        # Lógica de negocio
│   ├── mdx.ts                  # Server-only (usa fs)
│   ├── utils.ts                # Utilidades compartidas
│   └── content/
│       └── resolver.ts         # Server-only
├── public/                     # Assets estáticos
├── next.config.ts              # Configuración de Next.js
├── package.json
└── tsconfig.json
```

---

## 🎯 Principios Fundamentales

### 1. **Server-First Architecture**

**Regla:** Por defecto, todos los componentes son Server Components.

```typescript
// ✅ CORRECTO - Server Component por defecto
export default async function ProjectsPage() {
  const projects = await getAllPosts('projects');
  return <ProjectsClient projects={projects} />;
}

// ❌ INCORRECTO - Client Component innecesario
'use client';
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { /* fetch */ }, []);
}
```

**Cuándo usar Client Components:**
- ✅ Necesitas `useState`, `useEffect`, `useContext`
- ✅ Event handlers (`onClick`, `onChange`, `onSubmit`)
- ✅ Browser APIs (`window`, `localStorage`, `navigator`)
- ✅ Hooks de terceros que requieren client-side

**Cuándo NO usar Client Components:**
- ❌ Solo para renderizar datos estáticos
- ❌ Para componentes que no tienen interacción
- ❌ Para layouts que no cambian dinámicamente

---

### 2. **Separación Server/Client**

**Patrón Recomendado:**

```
/route
  ├── page.tsx          → Server Component (fetch data)
  └── RouteClient.tsx   → Client Component (UI + interacción)
```

**Ejemplo:**

```typescript
// app/(default)/projects/page.tsx (Server)
import { getAllPosts } from '@/lib/mdx';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const projects = getAllPosts('projects');
  return <ProjectsClient projects={projects} />;
}

// app/(default)/projects/ProjectsClient.tsx (Client)
'use client';
import { useState } from 'react';

export default function ProjectsClient({ projects }: { projects: any[] }) {
  const [filter, setFilter] = useState('all');
  // ... lógica de UI
}
```

---

### 3. **Límites de Responsabilidad**

| Directorio | Responsabilidad | Puede Usar | No Puede Usar |
|------------|-----------------|------------|---------------|
| `/app` | Routing, layouts, páginas | Server Components, async/await, fs | Browser APIs directamente |
| `/components` | UI reutilizable | Props, children | fs, path (excepto en Server Components) |
| `/lib` | Lógica de negocio | fs, path, crypto | Browser APIs, React hooks |
| `/content` | Contenido MDX | Frontmatter, MDX components | JavaScript logic |

---

## 📝 Convenciones de Código

### Imports

**Orden de Imports:**

```typescript
// 1. Types de Next.js/React
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// 2. Dependencias externas
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// 3. Utilidades internas (alias @/)
import { getAllPosts } from '@/lib/mdx';
import { cn } from '@/lib/utils';

// 4. Componentes internos
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// 5. Estilos (al final)
import '../globals.css';
```

**Usar Alias de Path:**

```typescript
// ✅ CORRECTO
import { Header } from '@/components/Header';
import { getAllPosts } from '@/lib/mdx';

// ❌ INCORRECTO
import { Header } from '../../components/Header';
import { getAllPosts } from '../../../lib/mdx';
```

---

### Naming Conventions

**Archivos:**

```
page.tsx              → Página de Next.js (Server Component)
layout.tsx            → Layout de Next.js (Server Component)
RouteClient.tsx       → Client Component específico de ruta
ComponentName.tsx     → Componente reutilizable (PascalCase)
utils.ts              → Utilidades (camelCase)
mdx.ts                → Módulo de lógica (camelCase)
```

**Componentes:**

```typescript
// ✅ CORRECTO - PascalCase para componentes
export function Header() { }
export default function ProjectsPage() { }

// ✅ CORRECTO - camelCase para funciones
export function getAllPosts() { }
export function getPostBySlug() { }

// ❌ INCORRECTO
export function header() { }  // Debe ser PascalCase
export function GetAllPosts() { }  // Debe ser camelCase
```

**Variables y Constantes:**

```typescript
// ✅ CORRECTO
const basePath = '/blog-portfolio';
const MAX_POSTS_PER_PAGE = 10;
const userEmail = 'user@example.com';

// ❌ INCORRECTO
const BasePath = '/blog-portfolio';  // No PascalCase para variables
const max_posts_per_page = 10;  // No snake_case
```

---

### TypeScript

**Siempre tipar props:**

```typescript
// ✅ CORRECTO
interface ProjectsClientProps {
  projects: Array<{
    title: string;
    slug: string;
    date: string;
  }>;
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  // ...
}

// ❌ INCORRECTO
export default function ProjectsClient({ projects }: any) {
  // ...
}
```

**Evitar `any`:**

```typescript
// ✅ CORRECTO
type Post = {
  title: string;
  content: string;
  date: string;
};

// ❌ INCORRECTO
const post: any = getPost();
```

**Usar tipos de Next.js:**

```typescript
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

---

## 🔒 Seguridad

### 1. **No usar `dangerouslySetInnerHTML`**

```typescript
// ❌ PROHIBIDO
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECTO - Usar MDX o sanitizar
import { MDXRemote } from 'next-mdx-remote/rsc';
<MDXRemote source={content} />
```

### 2. **Validar Inputs**

```typescript
// ✅ CORRECTO
import { z } from 'zod';

const EmailSchema = z.string().email().max(254);

function validateEmail(email: string) {
  return EmailSchema.safeParse(email);
}

// ❌ INCORRECTO
function validateEmail(email: string) {
  return email.includes('@');  // Validación débil
}
```

### 3. **No exponer Secrets**

```typescript
// ❌ PROHIBIDO
const API_KEY = 'sk_live_1234567890';

// ✅ CORRECTO
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ✅ MEJOR - Solo en build time
// next.config.ts
env: {
  NEXT_PUBLIC_FORMSPREE_ID: process.env.NEXT_PUBLIC_FORMSPREE_ID,
}
```

### 4. **CSP en Producción**

```typescript
// app/(default)/layout.tsx
<head>
  <meta httpEquiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-cdn.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    object-src 'none';
  " />
</head>
```

---

## ⚡ Rendimiento

### 1. **Code Splitting**

```typescript
// ✅ CORRECTO - Dynamic import para componentes pesados
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Si no necesita SSR
});

// ❌ INCORRECTO - Import estático de componente pesado
import HeavyComponent from './HeavyComponent';
```

### 2. **Optimización de Imágenes**

```typescript
// ✅ CORRECTO
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
  priority  // Solo para imagen hero
  placeholder="blur"
/>

// ❌ INCORRECTO
<img src="/hero.jpg" alt="Hero" />
```

### 3. **Lazy Loading**

```typescript
// ✅ CORRECTO - Lazy load de componentes no críticos
import { lazy, Suspense } from 'react';

const Comments = lazy(() => import('./Comments'));

export function BlogPost() {
  return (
    <>
      <Article />
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </>
  );
}
```

### 4. **Memoización**

```typescript
// ✅ CORRECTO - Memoizar cálculos costosos
import { useMemo } from 'react';

function ProjectsList({ projects }) {
  const filteredProjects = useMemo(
    () => projects.filter(p => p.featured),
    [projects]
  );
  
  return <>{/* ... */}</>;
}

// ❌ INCORRECTO - Filtrar en cada render
function ProjectsList({ projects }) {
  const filteredProjects = projects.filter(p => p.featured);
  return <>{/* ... */}</>;
}
```

---

## 🎨 Estilos

### 1. **Tailwind CSS**

**Usar clases de utilidad:**

```typescript
// ✅ CORRECTO
<div className="flex items-center gap-4 p-6 rounded-xl bg-surface">

// ❌ INCORRECTO - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

**Usar `cn()` para condicionales:**

```typescript
import { cn } from '@/lib/utils';

// ✅ CORRECTO
<button className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// ❌ INCORRECTO
<button className={`px-4 py-2 rounded-lg ${isActive ? 'bg-primary' : ''}`}>
```

### 2. **Design Tokens**

**Usar variables CSS definidas:**

```css
/* globals.css */
:root {
  --color-primary: #4f46e5;
  --color-surface: #ffffff;
}

.dark {
  --color-primary: #6366f1;
  --color-surface: #171717;
}
```

```typescript
// ✅ CORRECTO - Usar tokens de Tailwind
<div className="bg-primary text-primary-foreground">

// ❌ INCORRECTO - Colores hardcodeados
<div className="bg-[#4f46e5] text-white">
```

---

## 📦 Gestión de Estado

### 1. **Estado Local**

```typescript
// ✅ CORRECTO - useState para UI state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });

// ❌ INCORRECTO - Estado global innecesario
const { isOpen, setIsOpen } = useGlobalState();
```

### 2. **Estado de Servidor**

```typescript
// ✅ CORRECTO - Pasar datos desde Server Component
// page.tsx
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// ❌ INCORRECTO - Fetch en Client Component
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/data').then(/* ... */); }, []);
}
```

### 3. **Context (solo cuando sea necesario)**

```typescript
// ✅ CORRECTO - Context para tema, i18n
'use client';
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ❌ INCORRECTO - Context para datos que pueden ser props
const DataContext = createContext(null);
```

---

## 🧪 Testing

### 1. **Build Testing**

```bash
# Siempre verificar antes de commit
npm run build
npm run lint
```

### 2. **Type Checking**

```bash
# Verificar tipos sin compilar
npx tsc --noEmit
```

### 3. **Manual Testing Checklist**

- [ ] Todas las páginas cargan sin errores
- [ ] Formularios funcionan correctamente
- [ ] Navegación entre páginas funciona
- [ ] Tema claro/oscuro funciona
- [ ] Imágenes cargan correctamente
- [ ] No hay errores en consola

---

## 📚 Dependencias

### 1. **Actualización de Dependencias**

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores/patches
npm update

# Actualizar dependencias mayores (con cuidado)
npm install package@latest
```

### 2. **Auditoría de Seguridad**

```bash
# Ejecutar auditoría
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix

# Corregir vulnerabilidades con breaking changes
npm audit fix --force  # ⚠️ Usar con precaución
```

### 3. **Dependencias Permitidas**

**Core:**
- ✅ `next`, `react`, `react-dom`
- ✅ `typescript`, `@types/*`

**UI:**
- ✅ `tailwindcss`, `clsx`, `tailwind-merge`
- ✅ `framer-motion` (solo con LazyMotion)
- ✅ `lucide-react` (iconos)

**Content:**
- ✅ `next-mdx-remote`, `gray-matter`
- ✅ `next-intl` (i18n)

**Utils:**
- ✅ `date-fns`, `zod`

**Prohibidas:**
- ❌ `lodash` (usar utilidades nativas)
- ❌ `moment` (usar date-fns)
- ❌ `axios` (usar fetch nativo)
- ❌ Cualquier dependencia con vulnerabilidades conocidas

---

## 🚫 Anti-Patrones

### 1. **No usar `any`**

```typescript
// ❌ PROHIBIDO
function processData(data: any) { }

// ✅ CORRECTO
function processData(data: Post[]) { }
```

### 2. **No duplicar lógica**

```typescript
// ❌ INCORRECTO
// En múltiples archivos:
const posts = fs.readdirSync('content/posts');

// ✅ CORRECTO - Centralizar en lib/mdx.ts
export function getFiles(type: string) {
  return fs.readdirSync(`content/${type}`);
}
```

### 3. **No hardcodear URLs**

```typescript
// ❌ INCORRECTO
<a href="https://gtamayoc.github.io/blog-portfolio/projects">

// ✅ CORRECTO
import Link from 'next/link';
<Link href="/projects">
```

### 4. **No usar `console.log` en producción**

```typescript
// ❌ INCORRECTO
console.log('User data:', userData);

// ✅ CORRECTO
if (process.env.NODE_ENV === 'development') {
  console.log('User data:', userData);
}
```

---

## 📖 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDX](https://mdxjs.com/)

---

**Última actualización:** 2026-01-12  
**Versión:** 1.0  
**Mantenedor:** Giuseppe Tamayo C.
