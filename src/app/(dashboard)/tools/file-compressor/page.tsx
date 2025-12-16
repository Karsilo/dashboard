import Layout from "@/components/layout/layout";
import Page from "@/components/main/tools/file-compressor/Page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Karsilo | File Compressor",
    description: "Compress PDFs, images, and documents to reduce file size",
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

export default function FileCompressor() {
    return (
        <Layout>
            <Page />
        </Layout>
    );
}
