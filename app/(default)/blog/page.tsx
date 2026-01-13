import { getAllPosts, getPageData } from "@/lib/mdx";
import BlogClient from "./BlogClient";

export default function BlogPage() {
    const posts = getAllPosts("blog");
    const pageData = getPageData("blog");

    return <BlogClient posts={posts} pageData={pageData} />;
}
