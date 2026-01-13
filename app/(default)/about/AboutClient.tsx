"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    MapPin,
    Github,
    FileText,
    Smartphone,
    Globe,
    Database,
    Wrench,
    Award,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutClient({ data }: { data: any }) {
    const [mounted, setMounted] = useState(false);
    const [showAllCerts, setShowAllCerts] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-page" />;
    }

    const PROFILE = data.profile || {};
    const SKILLS = data.skills || [];
    const EXPERIENCE = data.experience || [];
    const EDUCATION = data.education || [];
    const CERTIFICATIONS = data.certifications || [];
    const SOCIALS = data.socials || {};

    const displayedCerts = showAllCerts ? CERTIFICATIONS : CERTIFICATIONS.slice(0, 3);

    return (
        <main className="min-h-screen bg-page py-12 md:py-20 px-4" suppressHydrationWarning>
            <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8" suppressHydrationWarning>

                {/* Sidebar */}
                <aside className="space-y-6" suppressHydrationWarning>
                    {/* Profile Card */}
                    <div className="bg-[#E5B8A5] rounded-2xl p-8 text-center shadow-sm relative overflow-hidden" suppressHydrationWarning>
                        {/* Avatar Placeholder */}
                        <div className="bg-surface p-3 rounded-lg shadow-sm mx-auto w-48 h-56 mb-6 rotate-[-2deg] flex items-center justify-center border border-black/5" suppressHydrationWarning>
                            <div className="w-full h-full bg-[#f3e5db] rounded-sm flex items-center justify-center" suppressHydrationWarning>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center px-4 opacity-50">Fotografía Profesional</span>
                            </div>
                        </div>

                        <div className="relative z-10" suppressHydrationWarning>
                            <div className="flex justify-center mb-4">
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-500/20" suppressHydrationWarning>
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    {PROFILE.availability_es || PROFILE.availability || "Abierto a propuestas"}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1" suppressHydrationWarning>{data.name || PROFILE.name}</h1>
                            <p className="text-primary font-semibold mb-6 shadow-sm bg-white/40 backdrop-blur-md rounded-full py-1.5 px-6 inline-block text-sm border border-white/20" suppressHydrationWarning>
                                {PROFILE.role_es || PROFILE.role}
                            </p>

                            <p className="text-slate-800 text-sm leading-relaxed mb-8 text-center text-balance font-medium opacity-90 px-4" suppressHydrationWarning>
                                {PROFILE.bio_es || PROFILE.bio}
                            </p>

                            <div className="flex gap-3 justify-center" suppressHydrationWarning>
                                <a
                                    href={SOCIALS.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/60 hover:bg-white rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow active:scale-95 group"
                                    suppressHydrationWarning title="GitHub"
                                >
                                    <Github className="w-5 h-5 text-slate-800 group-hover:text-primary transition-colors" />
                                </a>
                                <a
                                    href="/blog-portfolio/docs/cv-giuseppe-tamayo-cañizares.pdf"
                                    download="cv-giuseppe-tamayo-cañizares.pdf"
                                    className="p-3 bg-white/60 hover:bg-white rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow active:scale-95 group"
                                    suppressHydrationWarning title="Descargar CV"
                                >
                                    <FileText className="w-5 h-5 text-slate-800 group-hover:text-primary transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm flex items-start gap-4 transition-colors hover:border-primary/20" suppressHydrationWarning>
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary" suppressHydrationWarning>
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div suppressHydrationWarning>
                            <h3 className="font-bold text-text-primary text-sm" suppressHydrationWarning>Ubicación</h3>
                            <p className="text-text-secondary text-xs mt-1 font-medium" suppressHydrationWarning><span>{PROFILE.location}</span></p>
                            <p className="text-text-secondary/60 text-[10px] mt-1 uppercase font-bold tracking-wider" suppressHydrationWarning><span>{PROFILE.availability_es || PROFILE.availability}</span></p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8" suppressHydrationWarning>

                    {/* Expertise & Skills */}
                    <section className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm" suppressHydrationWarning>
                        <div className="flex items-center gap-3 mb-8" suppressHydrationWarning>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Wrench className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary" suppressHydrationWarning>Stack Tecnológico</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8" suppressHydrationWarning>
                            {SKILLS.map((skill: any) => {
                                const Icon = skill.category.includes("MÓVIL") || skill.category.includes("ANDROID") ? Smartphone :
                                    skill.category.includes("WEB") ? Globe :
                                        skill.category.includes("BACKEND") ? Database : Wrench;
                                return (
                                    <div key={skill.category} className="group" suppressHydrationWarning>
                                        <div className="flex items-center gap-2 mb-4" suppressHydrationWarning>
                                            <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase" suppressHydrationWarning>
                                                {skill.category_es || skill.category}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2" suppressHydrationWarning>
                                            {skill.items.map((item: string) => (
                                                <span key={item} className="px-3 py-1.5 bg-page border border-border-subtle rounded-xl text-xs font-semibold text-text-secondary hover:border-primary/30 transition-colors shadow-sm" suppressHydrationWarning>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Professional Journey (Experience) */}
                    <section className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm" suppressHydrationWarning>
                        <h2 className="text-xl font-bold text-text-primary mb-8" suppressHydrationWarning>Trayectoria Profesional</h2>
                        <div className="space-y-0 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border-subtle" />

                            {EXPERIENCE.map((job: any, index: number) => (
                                <div key={index} className="relative pl-8 pb-10 last:pb-0" suppressHydrationWarning>
                                    {/* Dot */}
                                    <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-surface transition-all ${job.current ? 'bg-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]' : 'bg-slate-300'}`} suppressHydrationWarning />

                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2" suppressHydrationWarning>
                                        <div suppressHydrationWarning>
                                            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors" suppressHydrationWarning>
                                                {job.role_es || job.role}
                                            </h3>
                                            <p className="text-sm font-bold text-primary opacity-80" suppressHydrationWarning>{job.company}</p>
                                        </div>
                                        <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider h-fit border transition-colors",
                                            job.current ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-hover text-text-secondary border-border-subtle')} suppressHydrationWarning>
                                            {job.period_es || job.period}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm leading-relaxed mt-3" suppressHydrationWarning>
                                        {job.description_es || job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education & Certifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8" suppressHydrationWarning>
                        {/* Education */}
                        <section className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm h-full" suppressHydrationWarning>
                            <h2 className="text-xl font-bold text-text-primary mb-8" suppressHydrationWarning>Educación</h2>
                            <div className="space-y-6" suppressHydrationWarning>
                                {EDUCATION.map((edu: any, index: number) => (
                                    <div key={index} className="relative border-l-2 border-border-subtle pl-6 py-1 hover:border-primary/50 transition-colors" suppressHydrationWarning>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1" suppressHydrationWarning>
                                            {edu.period}
                                        </span>
                                        <h3 className="text-sm font-bold text-text-primary leading-tight mb-1" suppressHydrationWarning>
                                            {edu.degree_es || edu.degree}
                                        </h3>
                                        <p className="text-xs font-medium text-text-secondary" suppressHydrationWarning>{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Certifications */}
                        <section className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm h-full flex flex-col" suppressHydrationWarning>
                            <h2 className="text-xl font-bold text-text-primary mb-8" suppressHydrationWarning>Certificaciones</h2>
                            <div className="space-y-4 flex-1" suppressHydrationWarning>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {displayedCerts.map((cert: any, index: number) => (
                                        <motion.div
                                            key={cert.title + index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-start gap-3 group"
                                            suppressHydrationWarning
                                        >
                                            <div className="mt-1">
                                                <Award className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div suppressHydrationWarning>
                                                <h3 className="text-sm font-bold text-text-primary leading-snug group-hover:text-primary transition-colors cursor-default" suppressHydrationWarning>
                                                    {cert.title}
                                                </h3>
                                                {(cert.issuer || cert.year) && (
                                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5" suppressHydrationWarning>
                                                        {cert.issuer} {cert.year && `· ${cert.year}`}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {CERTIFICATIONS.length > 3 && (
                                <button
                                    onClick={() => setShowAllCerts(!showAllCerts)}
                                    className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity pt-4 border-t border-border-subtle w-full"
                                    suppressHydrationWarning
                                >
                                    {showAllCerts ? (
                                        <>Ver Menos <ChevronUp className="w-3 h-3" /></>
                                    ) : (
                                        <>Ver Todas (+{CERTIFICATIONS.length - 3}) <ChevronDown className="w-3 h-3" /></>
                                    )}
                                </button>
                            )}
                        </section>
                    </div>

                    {/* Contact CTA */}
                    <section className="bg-surface rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" suppressHydrationWarning>
                        <div suppressHydrationWarning>
                            <h2 className="text-2xl font-bold text-text-primary" suppressHydrationWarning>¿Trabajamos juntos?</h2>
                            <p className="text-text-secondary mt-2" suppressHydrationWarning>Estoy disponible para nuevos proyectos y desafíos técnicos.</p>
                        </div>
                        <Link href="/contact" className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95" suppressHydrationWarning>
                            Contactar ahora
                        </Link>
                    </section>
                </div>
            </div>
        </main>
    );
}
