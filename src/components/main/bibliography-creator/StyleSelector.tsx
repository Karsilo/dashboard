"use client";

import { CitationStyle } from "@/types/citation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StyleSelectorProps {
    selectedStyle: CitationStyle;
    onStyleChange: (style: CitationStyle) => void;
}

const styles: Array<{
    value: CitationStyle;
    label: string;
    description: string;
    badge?: string;
}> = [
        {
            value: "APA",
            label: "APA",
            description: "American Psychological Association",
            badge: "Popular",
        },
        {
            value: "MLA",
            label: "MLA",
            description: "Modern Language Association (Humanities)",
        },
        {
            value: "Chicago",
            label: "Chicago",
            description: "Chicago Manual of Style (History)",
        },
        {
            value: "IEEE",
            label: "IEEE",
            description: "Institute of Electrical and Electronics Engineers (Technical)",
        },
        {
            value: "OSCOLA",
            label: "OSCOLA",
            description: "Oxford Standard for Citation of Legal Authorities",
        },
    ];

export default function StyleSelector({
    selectedStyle,
    onStyleChange,
}: StyleSelectorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Citation Style</CardTitle>
                <CardDescription>Choose your preferred citation format</CardDescription>
            </CardHeader>
            <CardContent>
                <Select value={selectedStyle} onValueChange={(value) => onStyleChange(value as CitationStyle)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {styles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{style.label}</span>
                                    {style.badge && (
                                        <Badge variant="secondary" className="text-xs">
                                            {style.badge}
                                        </Badge>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Supported Formats:</p>
                    <div className="space-y-1">
                        {styles.map((style) => (
                            <div
                                key={style.value}
                                className={`p-2 rounded-md transition-colors ${selectedStyle === style.value
                                        ? "bg-primary/10 border border-primary/20"
                                        : "bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">{style.label}</span>
                                        {style.badge && (
                                            <Badge variant="secondary" className="text-xs">
                                                {style.badge}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {style.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
