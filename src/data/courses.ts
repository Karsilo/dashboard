import { Atom, Calculator, LucideProps, Telescope } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface CourseLevel {
    id: string;
    name: string;
    description: string;
    slug: string;
}

export interface Subject {
    id: string;
    name: string;
    description: string;
    slug: string;
    subdomain: string;
    levels: CourseLevel[];
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    color?: string;
}

export const subjects: Subject[] = [
    {
        id: "mathematics",
        name: "Mathematics",
        description: "Comprehensive mathematics courses from fundamental to advanced level",
        slug: "mathematics",
        subdomain: "mathematics",
        color: "bg-blue-500",
        icon: Calculator,
        levels: [
            {
                id: "fundamental-mathematics",
                name: "Fundamental Mathematics",
                description: "Core mathematical concepts and foundations",
                slug: "fundamental-mathematics",
            },
            {
                id: "advanced-mathematics",
                name: "Advanced Mathematics",
                description: "Advanced topics including linear algebra, analysis, dynamics, and more",
                slug: "advanced-mathematics",
            },
        ],
    },
    {
        id: "physics",
        name: "Physics",
        description: "Physics courses covering fundamental and advanced topics",
        slug: "physics",
        subdomain: "physics",
        color: "bg-purple-500",
        icon: Atom,
        levels: [
            {
                id: "fundamental-physics",
                name: "Fundamental Physics",
                description: "Core physics concepts and principles",
                slug: "fundamental-physics",
            },
            {
                id: "advanced-physics",
                name: "Advanced Physics",
                description: "Advanced physics topics and theories",
                slug: "advanced-physics",
            },
        ],
    },
    {
        id: "astronomy",
        name: "Astronomy",
        description: "Explore the cosmos through astronomical studies",
        slug: "astronomy",
        subdomain: "astronomy",
        color: "bg-indigo-500",
        icon: Telescope,
        levels: [
            {
                id: "fundamental-astronomy",
                name: "Fundamental Astronomy",
                description: "Introduction to astronomical concepts",
                slug: "fundamental-astronomy",
            },
            {
                id: "advanced-astronomy",
                name: "Advanced Astronomy",
                description: "Advanced astronomical studies",
                slug: "advanced-astronomy",
            },
        ],
    },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
    return subjects.find((subject) => subject.slug === slug);
}

export function getSubjectBySubdomain(subdomain: string): Subject | undefined {
    return subjects.find((subject) => subject.subdomain === subdomain);
}

export function getLevelBySlug(subjectSlug: string, levelSlug: string): CourseLevel | undefined {
    const subject = getSubjectBySlug(subjectSlug);
    return subject?.levels.find((level) => level.slug === levelSlug);
}
