import NotFoundInfo from "@/components/ui/not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found | Salkaro",
    description: "The page you're looking for could not be found.",
};

export default function NotFound() {
    return <NotFoundInfo />;
}
