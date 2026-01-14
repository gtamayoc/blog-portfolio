"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function SmartBack() {
    const router = useRouter();

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md 
                 border border-zinc-200 dark:border-zinc-800 
                 text-sm font-medium text-zinc-600 dark:text-zinc-400 
                 hover:text-primary dark:hover:text-primary 
                 hover:border-primary/30 dark:hover:border-primary/30
                 shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="Go back"
        >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
        </motion.button>
    );
}
