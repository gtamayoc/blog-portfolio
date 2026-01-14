"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Code2, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

export default function ProjectsClient({ posts, pageData }: { posts: any[], pageData: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-page" suppressHydrationWarning />;
    }

    const ORDER = [
        "simulador-backend"
    ];

    const sortedPosts = [...posts].sort((a, b) => {
        return ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug);
    });

    if (!posts || posts.length === 0) {
        return (
            <main className="min-h-screen bg-page pb-20" suppressHydrationWarning>
                <div className="container mx-auto max-w-6xl px-4 pt-16 pb-12" suppressHydrationWarning>
                    <EmptyState
                        title="Próximamente"
                        message="Estamos preparando nuevos proyectos para mostrarte. ¡Vuelve pronto!"
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
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4" suppressHydrationWarning>
                            <span suppressHydrationWarning>{pageData?.title || "Proyectos Destacados"}</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed" suppressHydrationWarning>
                            <span suppressHydrationWarning>{pageData?.description || "Iniciativas de código abierto, herramientas experimentales y desarrollos web."}</span>
                        </p>
                    </div>
                    <div className="flex gap-3" suppressHydrationWarning>
                        <span className="px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-bold text-purple-700 shadow-sm" suppressHydrationWarning>
                            Web Development
                        </span>
                        <span className="px-5 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm font-bold text-orange-700 shadow-sm" suppressHydrationWarning>
                            Open Source
                        </span>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto max-w-6xl px-4" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" suppressHydrationWarning>
                    {sortedPosts.map((post) => {
                        return (
                            <div key={post.slug} className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-border-active transition-all duration-300 border border-border-subtle flex flex-col h-full" suppressHydrationWarning>
                                {/* Color Header Block */}
                                <div className={cn("h-48 w-full relative flex flex-col justify-between p-6 transition-colors", post.color || 'bg-surface-hover group-hover:bg-primary/5')} suppressHydrationWarning>
                                    <div className="self-end" suppressHydrationWarning>
                                        <span className={cn("px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase bg-surface/40 backdrop-blur-md text-text-primary border border-white/10")} suppressHydrationWarning>
                                            {post.tags?.[0] || "PROJECT"}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-black text-current opacity-10 leading-none tracking-tighter mix-blend-overlay" suppressHydrationWarning>
                                        {(post.title || post.slug).substring(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1" suppressHydrationWarning>
                                    <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight" suppressHydrationWarning>
                                        <span suppressHydrationWarning>{post.title_es || post.title}</span>
                                    </h3>
                                    <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1 line-clamp-3" suppressHydrationWarning>
                                        <span suppressHydrationWarning>{post.description_es || post.description}</span>
                                    </p>

                                    {/* Stack */}
                                    <div className="flex flex-wrap gap-2 mb-8" suppressHydrationWarning>
                                        {post.stack?.slice(0, 4).map((tech: string) => (
                                            <span key={tech} className="px-2.5 py-1.5 bg-surface-hover text-text-secondary text-[10px] font-bold rounded-md uppercase tracking-wide border border-border-subtle" suppressHydrationWarning>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-auto" suppressHydrationWarning>
                                        <Link href={`/projects/${post.slug}`} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold py-3 px-4 rounded-xl transition-all text-center shadow-md shadow-primary/20" suppressHydrationWarning>
                                            Explorar Proyecto
                                        </Link>
                                        {post.repo && (
                                            <a
                                                href={post.repo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 border border-border-subtle rounded-xl hover:bg-surface-hover text-text-secondary transition-colors"
                                                suppressHydrationWarning
                                                title="Ver Código"
                                            >
                                                <Code2 className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA & Stats */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6" suppressHydrationWarning>
                    <div className="md:col-span-2 bg-surface rounded-2xl p-10 border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" suppressHydrationWarning>
                        <div className="flex items-center gap-6" suppressHydrationWarning>
                            <div className="bg-primary/10 p-5 rounded-full" suppressHydrationWarning>
                                <Code2 className="w-8 h-8 text-primary" />
                            </div>
                            <div suppressHydrationWarning>
                                <h3 className="text-2xl font-bold text-text-primary" suppressHydrationWarning>Ingeniero Versátil</h3>
                                <p className="text-text-secondary mt-2 max-w-md" suppressHydrationWarning>
                                    Especializado en transformar requerimientos complejos en soluciones técnicas funcionales y escalables.
                                </p>
                            </div>
                        </div>
                        <a
                            href={pageData?.socials?.github || "https://github.com/gtamayoc"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20"
                            suppressHydrationWarning
                        >
                            <Github className="w-5 h-5" />
                            GitHub Hub
                        </a>
                    </div>

                    <div className="bg-surface rounded-2xl p-10 border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center" suppressHydrationWarning>
                        <span className="text-5xl font-black text-primary mb-2" suppressHydrationWarning>7+</span>
                        <span className="text-xs font-bold text-text-secondary tracking-[0.2em] uppercase" suppressHydrationWarning>Proyectos Activos</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
