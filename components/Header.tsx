"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Code2, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Header({ data }: { data?: any }) {
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <header className="sticky top-4 z-50 px-4 mb-8" />;
    }

    const displayName = data?.shortName || data?.name || "Giuseppe T.";

    return (
        <header className="sticky top-4 z-50 px-4 mb-8" suppressHydrationWarning>
            <nav className="max-w-6xl mx-auto bg-surface/80 backdrop-blur-md border border-border-subtle rounded-2xl p-3 flex items-center justify-between shadow-sm transition-colors duration-300" suppressHydrationWarning>
                <Link href="/" className="flex items-center gap-2 px-2 group" suppressHydrationWarning>
                    <span className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary/20 transition-colors inline-flex" suppressHydrationWarning>
                        <Code2 className="w-5 h-5" />
                    </span>
                    <span className="font-bold text-lg text-text-primary tracking-tight" suppressHydrationWarning>{displayName}</span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary" suppressHydrationWarning>
                    <Link href="/projects" className="hover:text-text-primary transition-colors" suppressHydrationWarning>Proyectos</Link>
                    <Link href="/android" className="hover:text-text-primary transition-colors" suppressHydrationWarning>Android</Link>
                    <Link href="/" className="hover:text-text-primary transition-colors" suppressHydrationWarning>Stack</Link>
                    <Link href="/blog" className="hover:text-text-primary transition-colors" suppressHydrationWarning>Blog</Link>
                    <Link href="/about" className="hover:text-text-primary transition-colors" suppressHydrationWarning>Acerca de</Link>
                </nav>

                <div className="flex items-center gap-3" suppressHydrationWarning>
                    <div className="hidden sm:flex items-center gap-2 mr-1" suppressHydrationWarning>
                        <ThemeToggle />
                    </div>
                    <Link
                        href="/contact"
                        className="hidden md:block bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                        suppressHydrationWarning
                    >
                        Contacto
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-text-secondary hover:text-text-primary bg-surface-hover rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 p-4 z-40 md:hidden"
                    >
                        <nav className="bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-2xl p-4 shadow-xl flex flex-col gap-4">
                            <Link
                                href="/projects"
                                className="p-2 text-lg font-medium text-text-secondary hover:text-text-primary border-b border-border-subtle/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Proyectos
                            </Link>
                            <Link
                                href="/android"
                                className="p-2 text-lg font-medium text-text-secondary hover:text-text-primary border-b border-border-subtle/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Android
                            </Link>
                            <Link
                                href="/"
                                className="p-2 text-lg font-medium text-text-secondary hover:text-text-primary border-b border-border-subtle/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Stack
                            </Link>
                            <Link
                                href="/blog"
                                className="p-2 text-lg font-medium text-text-secondary hover:text-text-primary border-b border-border-subtle/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                className="p-2 text-lg font-medium text-text-secondary hover:text-text-primary border-b border-border-subtle/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Acerca de
                            </Link>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm text-text-secondary font-medium px-2">Tema</span>
                                <ThemeToggle />
                            </div>

                            <Link
                                href="/contact"
                                className="mt-2 text-center bg-primary text-primary-foreground px-5 py-3 rounded-xl text-base font-bold shadow-sm active:scale-95 transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
