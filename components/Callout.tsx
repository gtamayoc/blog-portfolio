import { Info, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
    type?: "default" | "info" | "warning" | "danger" | "tip";
    title?: string;
    children: React.ReactNode;
}

const icons = {
    default: Info,
    info: Info,
    warning: AlertTriangle,
    danger: Flame,
    tip: CheckCircle,
};

export function Callout({ type = "default", title, children }: CalloutProps) {
    const Icon = icons[type];

    return (
        <div
            className={cn(
                "my-6 flex items-start gap-3 rounded-lg border p-4 text-sm",
                {
                    "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200": type === "info",
                    "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200": type === "warning",
                    "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200": type === "danger",
                    "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200": type === "tip",
                    "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200": type === "default",
                }
            )}
            suppressHydrationWarning
        >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
                {title && <div className="font-semibold mb-1">{title}</div>}
                <div className="leading-relaxed">{children}</div>
            </div>
        </div>
    );
}
