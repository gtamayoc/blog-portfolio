export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12" suppressHydrationWarning>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6" suppressHydrationWarning>
                <div className="md:col-span-2 md:row-span-2 min-h-[400px] bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="h-32 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="h-32 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="md:col-span-2 h-[260px] bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="h-48 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="h-48 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="h-32 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
                <div className="md:col-span-4 h-48 bg-muted animate-pulse rounded-3xl" suppressHydrationWarning />
            </div>
        </div>
    );
}
