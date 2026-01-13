import { getPostBySlug, getFiles } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
    const files = getFiles("blog");
    const slugs = new Set(files.map((file) =>
        file.replace(/(\.(es|en))?\.mdx$/, "")
    ));

    return Array.from(slugs).map((slug) => ({
        slug,
    }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug("blog", slug);

    if (!post) notFound();

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4" suppressHydrationWarning>
            <article className="prose prose-lg dark:prose-invert max-w-none" suppressHydrationWarning>
                <MDXContent source={post.content} />
            </article>
        </div>
    );
}
