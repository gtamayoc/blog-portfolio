import { getGlobalData } from "@/lib/mdx";
import ContactClient from "./ContactClient";

export default function ContactPage() {
    const globalData = getGlobalData();
    return <ContactClient data={globalData} />;
}
