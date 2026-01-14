import { getPostBySlug, getFiles } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";
import { SmartBack } from "@/components/SmartBack";
import { ScrollProgress } from "@/components/ScrollProgress";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
    const files = getFiles("android");
    const slugs = new Set(files.map((file) =>
        file.replace(/(\.(es|en))?\.mdx$/, "")
    ));

    return Array.from(slugs).map((slug) => ({
        slug,
    }));
}

export default async function AndroidProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug("android", slug);

    if (!post) notFound();

    return (
        <>
            <ScrollProgress />
            <div className="container mx-auto max-w-3xl py-12 px-4" suppressHydrationWarning>
                <SmartBack />
                <article className="prose-custom prose-lg max-w-none" suppressHydrationWarning>
                    <MDXContent source={post.content} />
                </article>
            </div>
        </>
    );
}
