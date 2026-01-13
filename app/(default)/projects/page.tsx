import { getAllPosts, getPageData, getGlobalData } from "@/lib/mdx";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsPage() {
    const posts = getAllPosts("projects");
    const pageData = getPageData("projects");
    const globalData = getGlobalData();

    return <ProjectsClient posts={posts} pageData={{ ...pageData, ...globalData }} />;
}
