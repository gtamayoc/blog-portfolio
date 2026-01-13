"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function BlogClient({ posts, pageData }: { posts: any[], pageData: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-page" suppressHydrationWarning />;
    }

    // Identify Featured Post
    const featuredPost = posts.find(p => p.featured) || posts[0];
    const otherPosts = posts.filter(p => p.slug !== featuredPost?.slug);

    if (!posts || posts.length === 0) {
        return (
            <main className="min-h-screen bg-page pb-20" suppressHydrationWarning>
                <div className="container mx-auto max-w-6xl px-4 pt-16 pb-12" suppressHydrationWarning>
                    <EmptyState
                        title="Blog en Construcción"
                        message="Estamos preparando artículos interesantes. Vuelve pronto para leer las últimas novedades."
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-page pb-20" suppressHydrationWarning>
            {/* Header Section */}
            <div className="container mx-auto max-w-6xl px-4 pt-16 pb-12" suppressHydrationWarning>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-2" suppressHydrationWarning>
                    Blog & Artículos
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl" suppressHydrationWarning>
                    Pensamientos sobre desarrollo, tecnología y diseño de productos.
                </p>
            </div>

            <div className="container mx-auto max-w-6xl px-4 space-y-12" suppressHydrationWarning>
                {/* Featured Hero Post */}
                {featuredPost && (
                    <Link href={`/blog/${featuredPost.slug}`} className="group block" suppressHydrationWarning>
                        <article className="grid md:grid-cols-2 gap-4 md:gap-8 bg-surface rounded-2xl p-6 md:p-8 border border-border-subtle shadow-sm hover:shadow-md hover:border-border-active transition-all duration-300" suppressHydrationWarning>
                            <div className="bg-surface-hover rounded-xl h-64 md:h-96 w-full relative overflow-hidden ring-1 ring-border-subtle" suppressHydrationWarning>
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-indigo-100 opacity-50" suppressHydrationWarning />
                                {featuredPost.featured && (
                                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10 shadow-sm" suppressHydrationWarning>
                                        Destacado
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center" suppressHydrationWarning>
                                <div className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-4" suppressHydrationWarning>
                                    <time suppressHydrationWarning>{featuredPost.date ? format(parseISO(featuredPost.date), "dd MMM, yyyy") : "Sin Fecha"}</time>
                                    <span suppressHydrationWarning>•</span>
                                    <span suppressHydrationWarning>{featuredPost.readTime || "5 min"} de lectura</span>
                                </div>

                                <h2 className="text-3xl font-extrabold text-text-primary mb-4 group-hover:text-primary transition-colors" suppressHydrationWarning>
                                    {featuredPost.title_es || featuredPost.title}
                                </h2>

                                <p className="text-text-secondary text-lg leading-relaxed mb-8 line-clamp-3" suppressHydrationWarning>
                                    {featuredPost.description_es || featuredPost.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8" suppressHydrationWarning>
                                    {featuredPost.tags?.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20" suppressHydrationWarning>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 text-primary font-bold text-sm" suppressHydrationWarning>
                                    Leer artículo completo <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </article>
                    </Link>
                )}

                {/* Secondary Posts Grid */}
                <div className="grid md:grid-cols-2 gap-8" suppressHydrationWarning>
                    {otherPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full" suppressHydrationWarning>
                            <article className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-border-active transition-all duration-300 h-full flex flex-col" suppressHydrationWarning>
                                <div className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-4" suppressHydrationWarning>
                                    <time suppressHydrationWarning>{post.date ? format(parseISO(post.date), "dd MMM, yyyy") : "Sin Fecha"}</time>
                                    {post.readTime && (
                                        <>
                                            <span>•</span>
                                            <span>{post.readTime} de lectura</span>
                                        </>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors" suppressHydrationWarning>
                                    {post.title_es || post.title}
                                </h2>

                                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1 line-clamp-3" suppressHydrationWarning>
                                    {post.description_es || post.description}
                                </p>

                                {post.tags && post.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-auto" suppressHydrationWarning>
                                        {post.tags.map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-surface-hover text-text-secondary text-[10px] font-bold rounded-md uppercase tracking-wide border border-border-subtle" suppressHydrationWarning>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-primary font-bold text-xs mt-auto" suppressHydrationWarning>
                                        Leer <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
