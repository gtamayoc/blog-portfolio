"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    MoveRight,
    Github,
    ExternalLink,
    Mail,
    Share2,
    Rocket,
    Code2,
    Globe,
    Linkedin
} from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { motion } from "framer-motion";

export default function HomeClient({ data }: { data: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!data) return null;
    if (!mounted) {
        return <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 min-h-screen bg-page" suppressHydrationWarning />;
    }

    const hero = data.hero || null;
    const stats = data.stats || null;
    const featured = data.featured_project || null;
    const cta = data.cta || null;
    const stack_items = data.stack ? data.stack.items : [];
    const socials = data.socials || {};

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12" suppressHydrationWarning>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6" suppressHydrationWarning>

                {/* HERO CARD */}
                {hero && (
                    <BentoCard className="md:col-span-2 md:row-span-2 relative min-h-[400px] justify-between group" suppressHydrationWarning>
                        <section className="space-y-6 relative z-10" suppressHydrationWarning>
                            {hero.status && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20"
                                    suppressHydrationWarning
                                >
                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" suppressHydrationWarning />
                                    <span suppressHydrationWarning>{hero.status}</span>
                                </motion.div>
                            )}

                            {hero.title && (
                                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] md:text-[clamp(3rem,6vw,5.5rem)] font-extrabold tracking-tight leading-tight" suppressHydrationWarning>
                                    {hero.title.split("&").map((p: string, i: number) => (
                                        <span key={i} suppressHydrationWarning>
                                            {i === 1 ? <span className="text-primary block" suppressHydrationWarning>& {p.trim()}</span> : p}
                                        </span>
                                    ))}
                                </h1>
                            )}

                            {hero.subtitle && (
                                <p className="text-muted-foreground text-lg max-w-md leading-relaxed" suppressHydrationWarning>
                                    {hero.subtitle}
                                </p>
                            )}
                        </section>

                        <section className="flex items-center justify-between relative z-10" suppressHydrationWarning>
                            <Link
                                href="/projects"
                                className="group bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all hover:gap-3"
                                suppressHydrationWarning
                            >
                                <span suppressHydrationWarning>Ver Proyectos</span> <MoveRight className="w-5 h-5" />
                            </Link>

                            {stack_items.length > 0 && (
                                <span className="flex -space-x-3" suppressHydrationWarning>
                                    {stack_items.slice(0, 3).map((item: string, i: number) => (
                                        <span key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold shadow-sm uppercase" suppressHydrationWarning>
                                            <span suppressHydrationWarning>{item.substring(0, 2)}</span>
                                        </span>
                                    ))}
                                    {stack_items.length > 3 && (
                                        <span className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold shadow-sm" suppressHydrationWarning>
                                            <span suppressHydrationWarning>+{stack_items.length - 3}</span>
                                        </span>
                                    )}
                                </span>
                            )}
                        </section>

                        {/* Decorative background element */}
                        <span className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" suppressHydrationWarning />
                    </BentoCard>
                )}

                {/* EXPERIENCE CARD */}
                {stats && stats.exp_value && (
                    <BentoCard className="justify-center items-center text-center space-y-2">
                        <span className="bg-primary/10 p-2 rounded-lg text-primary" suppressHydrationWarning>
                            <Code2 className="w-6 h-6" />
                        </span>
                        <span className="text-3xl font-bold block text-text-primary" suppressHydrationWarning>{stats.exp_value}</span>
                        <span className="text-[10px] font-black tracking-widest text-text-secondary uppercase block" suppressHydrationWarning>{stats.exp_label}</span>
                    </BentoCard>
                )}

                {/* STACK CARD */}
                {stack_items.length > 0 && (
                    <BentoCard id="stack" className="justify-center gap-4">
                        <span className="flex items-center gap-3" suppressHydrationWarning>
                            <span className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary" suppressHydrationWarning>
                                <Rocket className="w-4 h-4" />
                            </span>
                            <span className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary" suppressHydrationWarning>
                                <Globe className="w-4 h-4" />
                            </span>
                        </span>
                        <section suppressHydrationWarning>
                            <span className="font-bold text-sm block text-text-primary" suppressHydrationWarning>
                                Stack Tecnológico
                            </span>
                            <span className="text-xs text-text-secondary block" suppressHydrationWarning>{stack_items.join(", ")}</span>
                        </section>
                    </BentoCard>
                )}

                {/* FEATURED PROJECT CARD */}
                {featured && (
                    <BentoCard className="md:col-span-2 h-[260px] relative p-0 overflow-hidden group">
                        <Link href={featured.link} className="absolute inset-0 z-30" suppressHydrationWarning />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" suppressHydrationWarning />
                        {featured.image && (
                            <div className="absolute inset-0 z-0" suppressHydrationWarning>
                                <Image
                                    src={featured.image}
                                    alt="Project"
                                    fill
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={false}
                                />
                            </div>
                        )}
                        <section className="absolute bottom-0 left-0 p-6 z-20 w-full flex items-end justify-between" suppressHydrationWarning>
                            <span className="text-white space-y-1 block" suppressHydrationWarning>
                                <span className="text-lg md:text-xl font-bold block" suppressHydrationWarning>{featured.title}</span>
                                <span className="text-sm opacity-80 max-w-[80%] block" suppressHydrationWarning>{featured.description}</span>
                            </span>
                            <span className="bg-white/10 backdrop-blur-md p-2 rounded-lg text-white border border-white/20" suppressHydrationWarning>
                                <ExternalLink className="w-5 h-5" />
                            </span>
                        </section>
                    </BentoCard>
                )}

                {/* GITHUB CARD */}
                {stats && stats.github_value && (
                    <BentoCard className="bg-primary text-primary-foreground">
                        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full" suppressHydrationWarning>
                            <section className="flex justify-between items-start mb-4" suppressHydrationWarning>
                                <span className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm" suppressHydrationWarning>
                                    <Github className="w-5 h-5" />
                                </span>
                                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider" suppressHydrationWarning>GitHub</span>
                            </section>
                            <section className="mt-auto" suppressHydrationWarning>
                                <span className="text-4xl font-black italic block" suppressHydrationWarning>{stats.github_value}</span>
                                <span className="text-[10px] font-medium opacity-80 block" suppressHydrationWarning>{stats.github_label}</span>
                            </section>
                        </a>
                    </BentoCard>
                )}

                {/* ANDROID PROJECTS CARD */}
                <BentoCard className="justify-between group" suppressHydrationWarning>
                    <Link href="/android" className="h-full flex flex-col justify-between" suppressHydrationWarning>
                        <span className="bg-primary/10 w-fit p-2 rounded-lg text-primary block" suppressHydrationWarning>
                            <Rocket className="w-5 h-5" />
                        </span>
                        <section suppressHydrationWarning>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block" suppressHydrationWarning>
                                <span suppressHydrationWarning>Móvil</span>
                            </span>
                            <span className="font-bold leading-tight group-hover:text-primary transition-colors block" suppressHydrationWarning>
                                <span suppressHydrationWarning>Proyectos Android</span>
                            </span>
                        </section>
                        <section className="flex items-center gap-2 text-[10px] text-muted-foreground mt-4" suppressHydrationWarning>
                            <span suppressHydrationWarning>Ver Proyectos</span> <MoveRight className="w-3 h-3" />
                        </section>
                    </Link>
                </BentoCard>

                {/* SOCIAL LINKS CARD */}
                <BentoCard className="grid grid-cols-2 gap-2 p-3">
                    {socials.playstore && (
                        <a href={socials.playstore} target="_blank" className="bg-surface-hover text-text-secondary rounded-xl flex items-center justify-center p-3 hover:bg-surface-hover/80 hover:text-primary transition-colors" suppressHydrationWarning title="Play Store">
                            <Globe className="w-5 h-5" />
                        </a>
                    )}
                    {socials.linkedin && (
                        <a href={socials.linkedin} target="_blank" className="bg-surface-hover text-text-secondary rounded-xl flex items-center justify-center p-3 hover:bg-surface-hover/80 hover:text-primary transition-colors" suppressHydrationWarning title="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {socials.email && (
                        <a href={socials.email} className="bg-surface-hover text-text-secondary rounded-xl flex items-center justify-center p-3 hover:bg-surface-hover/80 hover:text-primary transition-colors" suppressHydrationWarning title="Email">
                            <Mail className="w-5 h-5" />
                        </a>
                    )}
                    {socials.twitter && (
                        <a href={socials.twitter} target="_blank" className="bg-surface-hover text-text-secondary rounded-xl flex items-center justify-center p-3 hover:bg-surface-hover/80 hover:text-primary transition-colors" suppressHydrationWarning title="Twitter">
                            <Share2 className="w-5 h-5" />
                        </a>
                    )}
                </BentoCard>

                {/* CTA CARD */}
                {cta && (
                    <BentoCard className="md:col-span-4 flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-10">
                        <section className="flex items-center gap-6 text-center md:text-left" suppressHydrationWarning>
                            <span className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner shrink-0" suppressHydrationWarning>
                                <Rocket className="w-8 h-8" />
                            </span>
                            <section className="space-y-1" suppressHydrationWarning>
                                <span className="text-2xl font-bold block text-text-primary" suppressHydrationWarning>{cta.title}</span>
                                <span className="text-text-secondary block" suppressHydrationWarning>{cta.subtitle}</span>
                            </section>
                        </section>
                        <Link
                            href="/contact"
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                            suppressHydrationWarning
                        >
                            Comenzar Conversación
                        </Link>
                    </BentoCard>
                )}

            </section>
        </main>
    );
}
