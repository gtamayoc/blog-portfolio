import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps extends NextImageProps {
    className?: string;
    caption?: string;
}

export function Image({ className, caption, alt, ...props }: ImageProps) {
    return (
        <figure className={cn("my-6", className)} suppressHydrationWarning>
            <NextImage
                className="rounded-lg border bg-muted"
                alt={alt}
                {...props}
                src={
                    typeof props.src === "string" && !props.src.startsWith("http")
                        ? `/blog-portfolio${props.src.startsWith("/") ? "" : "/"}${props.src}`
                        : props.src
                }
            />
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground" suppressHydrationWarning>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
