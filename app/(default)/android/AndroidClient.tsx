"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Wallet,
    Terminal,
    Code2,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

const ICON_MAP: Record<string, any> = {
    "pagos-qr": Wallet,
};

const COLOR_MAP: Record<string, string> = {
    "pagos-qr": "bg-emerald-100 text-emerald-600",
};

export default function AndroidClient({ posts, pageData }: { posts: any[], pageData: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-page" suppressHydrationWarning />;
    }
    const ORDER = ["pagos-qr"];

    const sortedPosts = [...posts].sort((a, b) => {
        return ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug);
    });

    if (!posts || posts.length === 0) {
        return (
            <main className="min-h-screen bg-page pb-20" suppressHydrationWarning>
                <div className="container mx-auto max-w-6xl px-4 pt-16 pb-12" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12" suppressHydrationWarning>
                        <div suppressHydrationWarning>
                            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-4" suppressHydrationWarning>
                                <span suppressHydrationWarning>{pageData?.title || "Desarrollo Android"}</span>
                            </h1>
                            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed" suppressHydrationWarning>
                                <span suppressHydrationWarning>{pageData?.description || "Especializado en aplicaciones financieras y sistemas embebidos."}</span>
                            </p>
                        </div>
                    </div>
                    <EmptyState
                        title="Próximamente"
                        message="Estoy preparando los detalles de mis proyectos Android más recientes. ¡Vuelve pronto!"
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-page pb-20" suppressHydrationWarning>
            {/* Header Section */}
            <div className="container mx-auto max-w-6xl px-4 pt-16 pb-12" suppressHydrationWarning>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6" suppressHydrationWarning>
                    <div suppressHydrationWarning>
                        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-4" suppressHydrationWarning>
                            <span suppressHydrationWarning>{pageData?.title || "Desarrollo Android"}</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed" suppressHydrationWarning>
                            <span suppressHydrationWarning>{pageData?.description || "Especializado en aplicaciones financieras y sistemas embebidos."}</span>
                        </p>
                    </div>
                    <div className="flex gap-3" suppressHydrationWarning>
                        <span className="px-4 py-2 bg-surface border border-border-subtle rounded-full text-sm font-semibold text-text-secondary shadow-sm" suppressHydrationWarning>
                            Senior Level
                        </span>
                        <span className="px-4 py-2 bg-surface border border-border-subtle rounded-full text-sm font-semibold text-text-secondary shadow-sm" suppressHydrationWarning>
                            Architect
                        </span>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto max-w-6xl px-4" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
                    {sortedPosts.map((post) => {
                        const Icon = ICON_MAP[post.slug] || Code2;
                        const iconColorClass = COLOR_MAP[post.slug] || "bg-gray-100 text-gray-600";

                        return (
                            <div key={post.slug} className="group bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-border-active transition-all duration-300 border border-border-subtle flex flex-col h-full" suppressHydrationWarning>
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4" suppressHydrationWarning>
                                    <div className={cn("p-3 rounded-2xl", iconColorClass)} suppressHydrationWarning>
                                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col items-end" suppressHydrationWarning>
                                        <h3 className="text-lg font-bold text-text-primary" suppressHydrationWarning>
                                            <span suppressHydrationWarning>{post.title_es || post.title}</span>
                                        </h3>
                                        <span className={cn("text-xs font-bold uppercase tracking-wider", iconColorClass.split(" ")[1])} suppressHydrationWarning>
                                            <span suppressHydrationWarning>{post.complexity_es || "Alta Complejidad"}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Complexity Bar & Visuals */}
                                <div className="flex items-center gap-2 mb-4" suppressHydrationWarning>
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Complejidad</span>
                                    <div className="h-1.5 flex-1 bg-surface-hover rounded-full overflow-hidden" suppressHydrationWarning>
                                        <div className="h-full w-3/4 bg-emerald-500 rounded-full" suppressHydrationWarning />
                                    </div>
                                </div>

                                {/* Architecture Tag */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mb-4" suppressHydrationWarning>
                                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                                            post.tags[0].includes("Architecture") ? "bg-emerald-500/10 text-emerald-700" :
                                                post.tags[0].includes("Performance") ? "bg-blue-500/10 text-blue-700" :
                                                    "bg-purple-500/10 text-purple-700"
                                        )} suppressHydrationWarning>
                                            {post.tags[0]}
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1" suppressHydrationWarning>
                                    <span suppressHydrationWarning>{post.description_es || post.description}</span>
                                </p>

                                {/* Stack */}
                                <div className="flex flex-wrap gap-2 mb-6" suppressHydrationWarning>
                                    {post.stack?.map((tech: string) => (
                                        <span key={tech} className="px-2 py-1 bg-surface-hover text-text-secondary text-[10px] font-bold rounded-md uppercase tracking-wide" suppressHydrationWarning>
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-auto" suppressHydrationWarning>
                                    <Link href={`/android/${post.slug}`} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors text-center shadow-sm" suppressHydrationWarning>
                                        Ver Detalles
                                    </Link>
                                    <button className="p-2.5 border border-border-subtle rounded-xl hover:bg-surface-hover text-text-secondary transition-colors" suppressHydrationWarning title="Código Fuente">
                                        <Code2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
                    <div className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" suppressHydrationWarning>
                        <div className="flex items-center gap-4" suppressHydrationWarning>
                            <div className="bg-emerald-500/10 p-4 rounded-2xl" suppressHydrationWarning>
                                <Terminal className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div suppressHydrationWarning>
                                <h3 className="text-xl font-bold text-text-primary" suppressHydrationWarning>Listo para Desafíos</h3>
                                <p className="text-text-secondary text-sm mt-1 max-w-xs" suppressHydrationWarning>
                                    Experiencia profunda en Java, Android SDK y optimización de recursos.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/blog-portfolio/docs/cv-giuseppe-tamayo-cañizares.pdf"
                            download="cv-giuseppe-tamayo-cañizares.pdf"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20"
                            suppressHydrationWarning
                        >
                            <Download className="w-4 h-4" />
                            Descargar CV
                        </a>
                    </div>

                    <div className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center" suppressHydrationWarning>
                        <span className="text-5xl font-extrabold text-emerald-600 mb-2" suppressHydrationWarning>3+</span>
                        <span className="text-xs font-bold text-text-secondary tracking-widest uppercase" suppressHydrationWarning>Años de Experiencia</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
