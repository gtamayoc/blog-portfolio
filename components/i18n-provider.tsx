"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface Translations {
    [key: string]: {
        [key: string]: string;
    };
}

const translations: Translations = {
    en: {
        nav_work: "Projects",
        nav_android: "Android",
        nav_stack: "Stack",
        nav_blog: "Blog",
        nav_about: "About",
        btn_contact: "Contact Me",
        btn_view_projects: "View Projects",
        footer_copy: "Built with passion and Kotlin.",
        btn_start_conversation: "Start a Conversation",
    },
    es: {
        nav_work: "Proyectos",
        nav_android: "Android",
        nav_stack: "Stack",
        nav_blog: "Blog",
        nav_about: "Sobre mí",
        btn_contact: "Contáctame",
        btn_view_projects: "Ver Proyectos",
        footer_copy: "Construido con pasión y Kotlin.",
        btn_start_conversation: "Iniciar una conversación",
    },
};

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>("en");

    useEffect(() => {
        const saved = localStorage.getItem("lang") as Language;
        if (saved && (saved === "en" || saved === "es")) {
            setLang(saved);
        }
    }, []);

    const handleSetLang = (l: Language) => {
        setLang(l);
        localStorage.setItem("lang", l);
    };

    const t = (key: string) => {
        return translations[lang][key] || key;
    };

    return (
        <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
