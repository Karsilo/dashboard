"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

// Define the structure of our PDFs
const questionData = {
    math: {
        name: "Mathematics",
        topics: [
            {
                name: "De Moivre's Theorem",
                questions: "/pdfs/math/de-moirves-theorem-questions.pdf",
                answers: "/pdfs/math/de-moirves-theorem-answers.pdf",
                description: "First and second-order ODEs, Bernoulli ODEs, homogeneous & non-homogeneous ODEs",
            },
            {
                name: "Ordinary Differential Equations",
                questions: "/pdfs/math/ordinary-differential-equations-questions.pdf",
                answers: "/pdfs/math/ordinary-differential-equations-answers.pdf",
                description: "First and second-order ODEs, Bernoulli ODEs, homogeneous & non-homogeneous ODEs",
            },
            {
                name: "Proof by Induction",
                questions: "/pdfs/math/proof-by-induction-questions.pdf",
                answers: "/pdfs/math/proof-by-induction-answers.pdf",
                description: "Summations, divisbility, matrices",
            },
            {
                name: "Roots of Unity",
                questions: "/pdfs/math/roots-of-unity-questions.pdf",
                answers: "/pdfs/math/roots-of-unity-answers.pdf",
                description: "Sums, products, and geometric properties of nth roots of unity",
            },
            {
                name: "Variant",
                questions: "/pdfs/math/variant-questions.pdf",
                answers: "/pdfs/math/variant-answers.pdf",
                description: "Questions from each topic",
            },
        ],
    },
    physics: {
        name: "Physics",
        topics: [
            {
                name: "Circular Motion",
                questions: "/pdfs/physics/circular-motion-questions.pdf",
                answers: "/pdfs/physics/circular-motion-answers.pdf",
                description: "Uniform and non-uniform circular motion, centripetal force, angular velocity/acceleration, and applications in orbital motion",
            },
            {
                name: "Oscillations",
                questions: "/pdfs/physics/oscillations-questions.pdf",
                answers: "/pdfs/physics/oscillations-answers.pdf",
                description: "Simple Harmonic Motion, Pendulums, Damping, Resonance, and Energy and Circuits",
            },
            {
                name: "Waves and Optics",
                questions: "/pdfs/physics/waves-and-optics-questions.pdf",
                answers: "/pdfs/physics/waves-and-optics-answers.pdf",
                description: "Mecahnical Waves, Sound Waves, Wave Properties of Light, Polarisation, and The Doppler Effect",
            },
        ],
    },
    astronomy: {
        name: "Astronomy",
        topics: [
            {
                name: "Planetary Motion",
                questions: "/pdfs/astronomy/planetary-motion-questions.pdf",
                answers: "/pdfs/astronomy/planetary-motion-answers.pdf",
                description: "Kepler's laws, elliptical orbits, orbital parameters, and hohmann transfer orbits.",
            },
            {
                name: "Variant",
                questions: "/pdfs/astronomy/variant-questions.pdf",
                answers: "/pdfs/astronomy/variant-answers.pdf",
                description: "Questions from each topic",
            },
        ],
    },
};

export default function Page() {
    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = (url: string) => {
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-muted-foreground mt-2">
                    Practice questions organized by subject and topic
                </p>
            </div>

            <Tabs defaultValue="math" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="math">Mathematics</TabsTrigger>
                    <TabsTrigger value="physics">Physics</TabsTrigger>
                    <TabsTrigger value="astronomy">Astronomy</TabsTrigger>
                </TabsList>

                {Object.entries(questionData).map(([key, subject]) => (
                    <TabsContent key={key} value={key} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {subject.topics.map((topic, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-500" />
                                            {topic.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {topic.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleView(topic.questions)}
                                            >
                                                View Questions
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDownload(
                                                        topic.questions,
                                                        `${topic.name.toLowerCase().replace(/ /g, "-")}-questions.pdf`
                                                    )
                                                }
                                            >
                                                <Download className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleView(topic.answers)}
                                            >
                                                View Answers
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDownload(
                                                        topic.answers,
                                                        `${topic.name.toLowerCase().replace(/ /g, "-")}-answers.pdf`
                                                    )
                                                }
                                            >
                                                <Download className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
