"use client";

import { Citation } from "@/types/citation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Pencil, Trash2, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { formatCitation } from "@/utils/citation-formatters";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface CitationListProps {
    citations: Citation[];
    onEditCitation: (citation: Citation) => void;
    onDeleteCitation: (id: string) => void;
}

export default function CitationList({
    citations,
    onEditCitation,
    onDeleteCitation,
}: CitationListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (citation: Citation) => {
        const formatted = formatCitation(citation, citation.style);
        const plainText = formatted.replace(/<em>/g, "").replace(/<\/em>/g, "");
        navigator.clipboard.writeText(plainText);
        toast.success("Citation copied to clipboard!");

        setCopiedId(citation.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string) => {
        onDeleteCitation(id);
        setDeletingId(null);
        toast.success("Citation deleted");
    };

    if (citations.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Bibliography</CardTitle>
                    <CardDescription>
                        {citations.length} entries
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-orange-500 mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No citations yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Add your first citation to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Your Bibliography</CardTitle>
                    <CardDescription>
                        {citations.length} {citations.length === 1 ? "entry" : "entries"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {citations.map((citation) => {
                            const formatted = formatCitation(citation, citation.style);
                            return (
                                <div
                                    key={citation.id}
                                    className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="capitalize bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                                                {citation.type}
                                            </Badge>
                                            <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">
                                                {citation.style}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleCopy(citation)}
                                                title="Copy citation"
                                            >
                                                {copiedId === citation.id ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditCitation(citation)}
                                                title="Edit citation"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDeletingId(citation.id)}
                                                title="Delete citation"
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatted }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Citation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this citation? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId && handleDelete(deletingId)}
                            className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
