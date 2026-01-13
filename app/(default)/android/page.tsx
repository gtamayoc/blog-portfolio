import { getAllPosts, getPageData, getGlobalData } from "@/lib/mdx";
import AndroidClient from "./AndroidClient";

export default function AndroidPage() {
    const posts = getAllPosts("android");
    const pageData = getPageData("android");
    const globalData = getGlobalData();

    return <AndroidClient posts={posts} pageData={{ ...pageData, ...globalData }} />;
}
