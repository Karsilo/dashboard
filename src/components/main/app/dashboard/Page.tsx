"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileQuestion, Wrench } from "lucide-react"


const Page = () => {
    const dashboardCards = [
        {
            title: "Courses",
            description: "Access your courses and learning materials",
            href: "/courses",
            icon: BookOpen,
            color: "text-blue-500"
        },
        {
            title: "Practice Questions",
            description: "Test your knowledge with practice problems",
            href: "/practice-questions",
            icon: FileQuestion,
            color: "text-green-500"
        },
        {
            title: "Tools",
            description: "Explore useful learning tools and resources",
            href: "/tools",
            icon: Wrench,
            color: "text-purple-500"
        }
    ]

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Choose where you'd like to go.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards.map((card) => (
                    <Link key={card.href} href={card.href} className="block transition-transform hover:scale-105">
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <card.icon className={`h-8 w-8 ${card.color}`} />
                                    <CardTitle className="text-xl">{card.title}</CardTitle>
                                </div>
                                <CardDescription className="mt-2">
                                    {card.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Page
