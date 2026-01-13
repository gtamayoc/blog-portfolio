"use client";

import { useState, useEffect } from "react";
import { Mail, Github, Linkedin, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactClient({ data }: { data: any }) {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        _gotcha: "" // Honeypot field
    });
    const [captcha, setCaptcha] = useState({ a: 0, b: 0, op: '+', result: 0 });
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState(false);



    useEffect(() => {
        setMounted(true);
        // Generar captcha aleatorio al montar (variedad de 2 dígitos)
        generateNewCaptcha();
    }, []);

    const generateNewCaptcha = () => {
        const a = Math.floor(Math.random() * 41) + 10; // 10 a 50
        const b = Math.floor(Math.random() * 41) + 10; // 10 a 50
        const isAdd = Math.random() > 0.4; // 60% probabilidad suma

        if (isAdd) {
            setCaptcha({ a, b, op: '+', result: a + b });
        } else {
            const max = Math.max(a, b);
            const min = Math.min(a, b);
            setCaptcha({ a: max, b: min, op: '-', result: max - min });
        }
    };




    const socials = data?.socials || {};
    const recipientEmail = socials.email?.replace("mailto:", "") || "gtamayoc@ufpso.edu.co";

    if (!mounted) {
        return <div className="min-h-screen bg-page" suppressHydrationWarning />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar captcha
        if (parseInt(userCaptcha) !== captcha.result) {
            setCaptchaError(true);
            setSendResult({ success: false, message: "El resultado del captcha es incorrecto. Por favor, intenta de nuevo." });
            return;
        }


        setIsSubmitting(true);
        setSendResult(null);
        setCaptchaError(false);

        const FORMSPREE_ID = "mjggvezp";
        const formspreeUrl = `https://formspree.io/f/${FORMSPREE_ID}`;

        try {
            // No enviamos _gotcha si tiene valor (los humanos no lo verán)
            if (formState._gotcha) {
                console.log("Spam detectado");
                setSendResult({ success: true, message: "¡Mensaje enviado con éxito!" });
                return;
            }

            const response = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formState)
            });

            const result = await response.json();

            if (response.ok) {
                setSendResult({ success: true, message: "¡Mensaje enviado con éxito! Te contactaré pronto." });
                setFormState({ name: "", email: "", subject: "", message: "", _gotcha: "" });
                setUserCaptcha("");
                // Regenerar captcha para el siguiente mensaje
                generateNewCaptcha();
            } else {


                const errorMsg = result.errors ? result.errors.map((err: any) => err.message).join(", ") : "Error al enviar.";
                setSendResult({ success: false, message: `Error: ${errorMsg}. Por favor, intenta de nuevo o usa WhatsApp.` });
            }
        } catch (error) {
            setSendResult({ success: false, message: "Error de conexión. Intenta de nuevo más tarde." });
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    };


    return (
        <main className="min-h-screen bg-page py-12 md:py-20 px-4" suppressHydrationWarning>
            <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8" suppressHydrationWarning>

                {/* Contact Info Column */}
                <div className="bg-surface rounded-2xl p-8 md:p-12 border border-border-subtle shadow-sm flex flex-col h-full" suppressHydrationWarning>
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Disponible para Proyectos
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary mt-6 mb-6" suppressHydrationWarning>
                            <span suppressHydrationWarning>Hablemos de tu próximo paso.</span>
                        </h1>
                        <p className="text-text-secondary text-lg leading-relaxed mb-8" suppressHydrationWarning>
                            <span suppressHydrationWarning>¿Tienes una idea innovadora o un desafío técnico? Estoy aquí para ayudarte a construir soluciones robustas y escalables.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                        {/* Email Card */}
                        {socials.email && (
                            <a href={socials.email} className="flex items-center gap-4 p-4 border border-border-subtle rounded-xl hover:bg-surface-hover transition-all group shadow-sm hover:shadow-md">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-0.5 opacity-60">Email</p>
                                    <p className="text-text-primary text-xs font-bold truncate">{recipientEmail}</p>
                                </div>
                            </a>
                        )}

                        {/* WhatsApp Card */}
                        {socials.phone && (
                            <a href={`https://wa.me/${socials.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border-subtle rounded-xl hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group shadow-sm hover:shadow-md">
                                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-wider mb-0.5">WhatsApp</p>
                                    <p className="text-text-primary text-xs font-bold truncate">Enviar Mensaje</p>
                                </div>
                            </a>
                        )}

                        {/* LinkedIn Card */}
                        {socials.linkedin && (
                            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border-subtle rounded-xl hover:bg-surface-hover transition-all group shadow-sm hover:shadow-md">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform shrink-0">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-0.5 opacity-60">LinkedIn</p>
                                    <p className="text-text-primary text-xs font-bold truncate">Giuseppe Tamayo</p>
                                </div>
                            </a>
                        )}

                        {/* Github Card */}
                        {socials.github && (
                            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border-subtle rounded-xl hover:bg-surface-hover transition-all group shadow-sm hover:shadow-md">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform shrink-0">
                                    <Github className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-0.5 opacity-60">GitHub</p>
                                    <p className="text-text-primary text-xs font-bold truncate">@gtamayoc</p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>

                {/* Contact Form Column */}
                <div className="bg-surface rounded-2xl p-8 md:p-12 border border-border-subtle shadow-sm flex flex-col h-full" suppressHydrationWarning>
                    <h2 className="text-2xl font-bold text-text-primary mb-8">Enviar un mensaje</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-bold text-text-secondary">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full p-4 bg-page border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-medium text-text-primary placeholder:text-text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-text-secondary">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    placeholder="tu@email.com"
                                    className="w-full p-4 bg-page border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-medium text-text-primary placeholder:text-text-secondary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-bold text-text-secondary">Asunto</label>
                            <input
                                type="text"
                                id="subject"
                                required
                                value={formState.subject}
                                onChange={handleInputChange}
                                placeholder="¿En qué puedo ayudarte?"
                                className="w-full p-4 bg-page border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-medium text-text-primary placeholder:text-text-secondary/50"
                            />
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <label htmlFor="message" className="text-sm font-bold text-text-secondary">Mensaje</label>
                            <textarea
                                id="message"
                                required
                                value={formState.message}
                                onChange={handleInputChange}
                                placeholder="Cuéntame sobre tu proyecto..."
                                className="w-full p-4 bg-page border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-medium text-text-primary placeholder:text-text-secondary/50 flex-1 min-h-[120px] resize-none"
                            ></textarea>
                        </div>

                        {/* Honeypot field (hidden from users) */}
                        <input
                            type="text"
                            id="_gotcha"
                            value={formState._gotcha}
                            onChange={handleInputChange}
                            className="hidden"
                            autoComplete="off"
                        />

                        {/* Simple Math Captcha */}
                        <div className="space-y-4 p-4 bg-page/50 border border-border-subtle rounded-xl">
                            <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                Captcha de seguridad
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Requerido</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-surface border border-border-subtle px-4 py-3 rounded-lg font-mono text-lg font-bold text-primary shadow-inner">
                                    <span>{captcha.a}</span>
                                    <span className="text-text-secondary opacity-50">{captcha.op}</span>
                                    <span>{captcha.b}</span>
                                    <span className="text-text-secondary opacity-50">=</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={userCaptcha}
                                    onChange={(e) => {
                                        setUserCaptcha(e.target.value);
                                        setCaptchaError(false);
                                    }}
                                    placeholder="?"
                                    className={cn(
                                        "flex-1 p-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition-all font-bold text-center text-lg",
                                        captchaError ? "border-red-500 ring-red-500/20" : "border-border-subtle focus:ring-primary/20 focus:border-primary"
                                    )}
                                />
                            </div>
                            <p className="text-[11px] text-text-secondary opacity-70">
                                Por favor, resuelve esta operación para confirmar que eres humano.
                            </p>

                        </div>


                        {sendResult && (
                            <div className={cn("p-4 rounded-xl text-sm font-bold text-center",
                                sendResult.success ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20")}>
                                {sendResult.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-auto active:scale-[0.98]"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Mensaje"} <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>
        </main>
    );
}
