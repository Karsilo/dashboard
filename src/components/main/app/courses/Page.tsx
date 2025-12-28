"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import { subjects } from "@/data/courses";

export default function Page() {
    const handleCreateUrl = (subdomain: string) => {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT || "karsilo.com";
        const protocol = rootDomain.includes("localhost") ? "http://" : "https://";
        return `${protocol}${subdomain}.${rootDomain}`;  
    };


    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-muted-foreground mt-2">
                    Browse and access all available courses. Each subject contains multiple levels from fundamental to advanced.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => {
                    const Icon = subject.icon;
                    const url = handleCreateUrl(subject.subdomain);
                    return (
                        <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${subject.color || "bg-blue-500"}`}>
                                        {Icon && <Icon className="h-6 w-6 text-white" />}
                                    </div>
                                    <div>
                                        <CardTitle>{subject.name}</CardTitle>
                                    </div>
                                </div>
                                <CardDescription className="mt-2">
                                    {subject.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        Available Levels
                                    </h4>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        {subject.levels.map((level) => (
                                            <li key={level.id} className="flex items-start gap-2">
                                                <span className="mt-1">•</span>
                                                <div>
                                                    <span className="font-medium text-foreground">{level.name}</span>
                                                    <p className="text-xs">{level.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    className="w-full group"
                                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                                >
                                    Go to {subject.name}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
