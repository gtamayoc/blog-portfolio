import fs from 'fs';
import path from 'path';

const STYLE_GUIDE_PATH = path.join(process.cwd(), 'ui-code-style-gtc.md');

export interface FallbackData {
    summary: string;
    skills: {
        languages: string[];
        databases: string[];
        functional: string[];
    };
    projects: any[];
    experience: any[];
}

function parseStyleGuide(): FallbackData {
    if (!fs.existsSync(STYLE_GUIDE_PATH)) {
        console.warn(`[ContentResolver] Style guide not found at ${STYLE_GUIDE_PATH}`);
        return { summary: "", skills: { languages: [], databases: [], functional: [] }, projects: [], experience: [] };
    }

    const content = fs.readFileSync(STYLE_GUIDE_PATH, 'utf8');

    // Extract Summary
    const summaryMatch = content.match(/Summary\s+([\s\S]*?)(?=Skills)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    // Extract Skills
    const languagesMatch = content.match(/Lenguajes y Tecnologías\s+([\s\S]*?)(?=\n\n|\r\n\r\n)/i);
    const databasesMatch = content.match(/Bases de Datos\s+([\s\S]*?)(?=\n\n|\r\n\r\n)/i);
    const functionalMatch = content.match(/Dominio Funcional\s+([\s\S]*?)(?=\n\n|\r\n\r\n)/i);

    const skills = {
        languages: languagesMatch ? languagesMatch[1].split(',').map(s => s.trim()) : [],
        databases: databasesMatch ? databasesMatch[1].split(',').map(s => s.trim()) : [],
        functional: functionalMatch ? functionalMatch[1].split(',').map(s => s.trim()) : []
    };

    // Basic project extraction (simplified for fallback)
    const projects: any[] = [];
    const projectSection = content.match(/Projects\s+([\s\S]*?)(?=Certifications)/i);
    if (projectSection) {
        // This is a rough parser based on the known format
        // const blocks = projectSection[1].split(/\n\n/);
        // We could try to parse these blocks into structured data if needed
        // For now, let's just use the style guide existence to confirm specific project fallbacks
    }

    return { summary, skills, projects, experience: [] };
}

export function getFallbackContent(type: string, slug?: string) {
    const data = parseStyleGuide();

    if (type === 'pages' && slug === 'home') {
        // Return fallback for home page using summary and skills
        return {
            title: "Home",
            content: `
# Hola, soy Giuseppe

${data.summary}

## Mis Habilidades

${data.skills.languages.map(s => `- ${s}`).join('\n')}
`
        };
    }

    if (type === 'projects') {
        // Return a generic fallback for a project
        return {
            title: slug ? slug.replace(/-/g, ' ') : "Proyecto en construcción",
            description: "La información detallada de este proyecto se está actualizando.",
            date: new Date().toISOString(),
            tags: ["En construcción"],
            content: `
# ${slug ? slug.replace(/-/g, ' ') : "Próximamente"}

Este detalle de proyecto se encuentra actualmente en redacción. Revisa mi perfil para más información.
`
        };
    }

    if (type === 'blog') {
        return {
            title: "Artículo en redacción",
            description: "Este contenido estará disponible pronto.",
            date: new Date().toISOString(),
            tags: ["Blog"],
            content: `
# Próximamente

Estamos preparando contenido interesante para este blog. ¡Vuelve pronto!
`
        };
    }

    return null;
}
