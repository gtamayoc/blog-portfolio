import { getPageData, getGlobalData } from "@/lib/mdx";
import AboutClient from "./AboutClient";

export default function AboutPage() {
    const data = getPageData("about");
    const globalData = getGlobalData();

    if (!data) return null;

    return <AboutClient data={{ ...data, ...globalData }} />;
}
