import Layout from "@/components/layout/layout";
import Page from "@/components/main/app/questions/Page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Karsilo | Questions",
    description: "Practice questions organized by subject",
};

export default function Questions() {
    return (
        <Layout>
            <Page />
        </Layout>
    );
}
