import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export function ProjectHeader({ title, description, className }: ProjectHeaderProps) {
    return (
        <div className={cn("flex flex-col space-y-2 border-b pb-8 mb-8", className)} suppressHydrationWarning>
            <h1 className="text-3xl font-bold tracking-tight" suppressHydrationWarning>{title}</h1>
            {description && <p className="text-xl text-muted-foreground" suppressHydrationWarning>{description}</p>}
        </div>
    );
}
