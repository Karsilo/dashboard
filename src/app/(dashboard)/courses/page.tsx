import Layout from "@/components/layout/layout";
import Page from "@/components/main/app/courses/Page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Karsilo | Courses",
    description: "Browse and access all available courses",
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

export default function Courses() {
    return (
        <Layout>
            <Page />
        </Layout>
    );
}
