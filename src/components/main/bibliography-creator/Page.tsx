"use client";

import { useState, useEffect } from "react";
import { Citation } from "@/types/citation";
import CitationDialog from "./CitationDialog";
import CitationList from "./CitationList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const STORAGE_KEY = "bibliography-citations";

const getInitialCitations = (): Citation[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error("Failed to load citations from storage:", error);
        }
    }
    return [];
};

const Page = () => {
    const [citations, setCitations] = useState<Citation[]>(getInitialCitations);
    const [editingCitation, setEditingCitation] = useState<Citation | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(citations));
    }, [citations]);

    const handleAddCitation = (citation: Citation) => {
        setCitations((prev) => [...prev, citation]);
    };

    const handleUpdateCitation = (citation: Citation) => {
        setCitations((prev) =>
            prev.map((c) => (c.id === citation.id ? citation : c))
        );
        setEditingCitation(undefined);
    };

    const handleDeleteCitation = (id: string) => {
        setCitations((prev) => prev.filter((c) => c.id !== id));
    };

    const handleEditCitation = (citation: Citation) => {
        setEditingCitation(citation);
        setIsDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingCitation(undefined);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground mt-2">
                        Create professional citations in multiple formats
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Citation
                </Button>
            </div>

            <CitationList
                citations={citations}
                onEditCitation={handleEditCitation}
                onDeleteCitation={handleDeleteCitation}
            />

            <CitationDialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                onAddCitation={handleAddCitation}
                editingCitation={editingCitation}
                onUpdateCitation={handleUpdateCitation}
            />
        </div>
    );
};

export default Page;
