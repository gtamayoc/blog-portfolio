import { MDXRemote } from "next-mdx-remote/rsc";
import { ProjectHeader } from "./ProjectHeader";
import { BlogHero } from "./BlogHero";
import { Callout } from "./Callout";
import { Image } from "./Image";

const components = {
    ProjectHeader,
    BlogHero,
    Callout,
    Image,
};

export function MDXContent({ source }: { source: string }) {
    return (
        <div suppressHydrationWarning>
            <MDXRemote source={source} components={components} />
        </div>
    );
}
