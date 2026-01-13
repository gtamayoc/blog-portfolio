import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface BlogHeroProps {
    title: string;
    date: string;
    readTime?: string;
    className?: string;
}

export function BlogHero({ title, date, readTime, className }: BlogHeroProps) {
    return (
        <div className={cn("flex flex-col space-y-4 mb-8 text-center", className)} suppressHydrationWarning>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl" suppressHydrationWarning>{title}</h1>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground" suppressHydrationWarning>
                <time dateTime={date} suppressHydrationWarning>{format(parseISO(date), "MMMM d, yyyy")}</time>
                {readTime && (
                    <>
                        <span suppressHydrationWarning>•</span>
                        <span suppressHydrationWarning>{readTime}</span>
                    </>
                )}
            </div>
            <hr className="mt-8 border-t" suppressHydrationWarning />
        </div>
    );
}
