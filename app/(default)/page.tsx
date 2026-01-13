import { getPageData, getGlobalData } from "@/lib/mdx";
import HomeClient from "./HomeClient";

export default function Home() {
  const homeData = getPageData("home");
  const globalData = getGlobalData();

  if (!homeData) return null;

  return <HomeClient data={{ ...homeData, ...globalData }} />;
}
