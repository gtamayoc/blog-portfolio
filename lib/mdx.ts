import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFallbackContent } from "./content/resolver";

const root = process.cwd();

export function getFiles(type: string) {
    const directory = path.join(root, "content", type);
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory);
}

export function getPostBySlug(type: string, slug: string) {
    const realSlug = slug.replace(/\.mdx$/, "");
    const filePath = path.join(root, "content", type, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        const fallback = getFallbackContent(type, slug);
        if (fallback) {
            return { ...fallback, slug: realSlug };
        }
        return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return { ...data, slug: realSlug, content } as any;
}

export function getAllPosts(type: string) {
    const files = getFiles(type);

    const slugs = Array.from(new Set(files.map(file => {
        return file.replace(/\.mdx$/, "");
    })));

    const posts = slugs
        .map((slug) => getPostBySlug(type, slug))
        .filter(post => post !== null);

    return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}

export function getPageData(slug: string) {
    return getPostBySlug("pages", slug);
}

export function getGlobalData() {
    return getPostBySlug("pages", "global");
}
