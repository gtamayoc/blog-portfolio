"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "primary" | "secondary";
    id?: string;
    suppressHydrationWarning?: boolean;
}

export function BentoCard({ children, className, variant = "default", id, suppressHydrationWarning }: BentoCardProps) {
    const variants = {
        default: "bg-surface border border-border-subtle shadow-sm",
        primary: "bg-primary text-primary-foreground border-transparent shadow-primary/20",
        secondary: "bg-surface-hover text-text-secondary border-transparent",
    };

    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
                "rounded-2xl p-6 overflow-hidden flex flex-col transition-all duration-200",
                "hover:shadow-md hover:border-border-active hover:-translate-y-px",
                variants[variant],
                className
            )}
            suppressHydrationWarning
        >
            {children}
        </motion.section>
    );
}
