"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Twitter, PlayCircle } from "lucide-react";

export function Footer({ data }: { data?: any }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const year = new Date().getFullYear();

    if (!data) return null;
    if (!mounted) {
        return <footer className="max-w-6xl mx-auto px-4 py-12" />;
    }

    const { socials, footer } = data;
    const copy = footer?.copy || "";

    return (
        <footer className="max-w-6xl mx-auto px-4 py-12" suppressHydrationWarning>
            <section className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6" suppressHydrationWarning>
                <span className="flex items-center gap-2 text-text-secondary text-sm" suppressHydrationWarning>
                    <span className="w-4 h-4 bg-primary rounded-sm opacity-60" suppressHydrationWarning />
                    <span suppressHydrationWarning>© {year} {data.name} | {copy}</span>
                </span>

                <span className="flex items-center gap-6 text-sm font-medium text-text-secondary flex-wrap justify-center md:justify-end" suppressHydrationWarning>
                    {socials?.playstore && (
                        <a href={socials.playstore} target="_blank" className="flex items-center gap-1.5 hover:text-text-primary transition-colors" suppressHydrationWarning>
                            <PlayCircle className="w-4 h-4" /> <span suppressHydrationWarning>PlayStore</span>
                        </a>
                    )}
                    {socials?.github && (
                        <a href={socials.github} target="_blank" className="flex items-center gap-1.5 hover:text-text-primary transition-colors" suppressHydrationWarning>
                            <Github className="w-4 h-4" /> <span suppressHydrationWarning>GitHub</span>
                        </a>
                    )}
                    {socials?.linkedin && (
                        <a href={socials.linkedin} target="_blank" className="flex items-center gap-1.5 hover:text-text-primary transition-colors" suppressHydrationWarning>
                            <Linkedin className="w-4 h-4" /> <span suppressHydrationWarning>LinkedIn</span>
                        </a>
                    )}
                    {socials?.twitter && (
                        <a href={socials.twitter} target="_blank" className="flex items-center gap-1.5 hover:text-text-primary transition-colors" suppressHydrationWarning>
                            <Twitter className="w-4 h-4" /> <span suppressHydrationWarning>Twitter</span>
                        </a>
                    )}
                </span>
            </section>
        </footer>
    );
}
