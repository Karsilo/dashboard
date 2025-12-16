import Layout from "@/components/layout/layout";
import Page from "@/components/main/tools/bibliography-creator/Page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Salkaro | Bibliography Creator",
    description: "Create professional citations in APA, MLA, Chicago, IEEE, and OSCOLA formats",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function BibliographyCreator() {
    return (
        <Layout>
            <Page />
        </Layout>
    );
}
