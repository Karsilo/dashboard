"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Citation, CitationFormData } from "@/types/citation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import CitationFormFields from "./CitationFormFields";

interface CitationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddCitation?: (citation: Citation) => void;
    editingCitation?: Citation;
    onUpdateCitation?: (citation: Citation) => void;
}

export default function CitationDialog({
    open,
    onOpenChange,
    onAddCitation,
    editingCitation,
    onUpdateCitation,
}: CitationDialogProps) {
    const [autoFillInput, setAutoFillInput] = useState("");
    const [isAutoFilling, setIsAutoFilling] = useState(false);

    const getInitialFormData = (): CitationFormData => {
        if (editingCitation) {
            return {
                type: editingCitation.type,
                style: editingCitation.style,
                authors: editingCitation.authors.join("; "),
                title: editingCitation.title,
                source: editingCitation.source,
                year: editingCitation.year,
                url: editingCitation.url || "",
                doi: editingCitation.doi || "",
                isbn: editingCitation.isbn || "",
                publisher: editingCitation.publisher || "",
                volume: editingCitation.volume || "",
                issue: editingCitation.issue || "",
                pages: editingCitation.pages || "",
                accessDate: editingCitation.accessDate || "",
            };
        }
        return {
            type: "website",
            style: "APA",
            authors: "",
            title: "",
            source: "",
            year: "",
            url: "",
            doi: "",
            isbn: "",
            publisher: "",
            volume: "",
            issue: "",
            pages: "",
            accessDate: "",
        };
    };

    const [formData, setFormData] = useState<CitationFormData>(getInitialFormData);

    // Update form data when editingCitation changes
    useEffect(() => {
        if (open) {
            setFormData(getInitialFormData());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingCitation, open]);

    const handleAutoFill = async () => {
        if (!autoFillInput.trim()) {
            toast.error("Please enter a URL, ISBN, or DOI");
            return;
        }

        setIsAutoFilling(true);
        try {
            const response = await fetch("/api/citation/autofill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: autoFillInput }),
            });

            if (!response.ok) {
                throw new Error("Failed to auto-fill");
            }

            const data = await response.json();

            setFormData((prev) => ({
                ...prev,
                type: data.type || prev.type,
                authors: data.authors ? data.authors.join("; ") : prev.authors,
                title: data.title || prev.title,
                source: data.source || prev.source,
                year: data.year || prev.year,
                url: data.url || prev.url,
                doi: data.doi || prev.doi,
                isbn: data.isbn || prev.isbn,
                publisher: data.publisher || prev.publisher,
                volume: data.volume || prev.volume,
                issue: data.issue || prev.issue,
                pages: data.pages || prev.pages,
                accessDate: data.accessDate || prev.accessDate,
            }));

            toast.success("Citation details auto-filled!");
            setAutoFillInput("");
        } catch (error) {
            toast.error("Failed to auto-fill citation details");
            console.error(error);
        } finally {
            setIsAutoFilling(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.authors.trim() || !formData.title.trim() || !formData.year.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        const citation: Citation = {
            id: editingCitation?.id || Date.now().toString(),
            type: formData.type,
            style: formData.style,
            authors: formData.authors.split(";").map((a) => a.trim()).filter(Boolean),
            title: formData.title,
            source: formData.source,
            year: formData.year,
            url: formData.url || undefined,
            doi: formData.doi || undefined,
            isbn: formData.isbn || undefined,
            publisher: formData.publisher || undefined,
            volume: formData.volume || undefined,
            issue: formData.issue || undefined,
            pages: formData.pages || undefined,
            accessDate: formData.accessDate || undefined,
            createdAt: editingCitation?.createdAt || Date.now(),
        };

        if (editingCitation && onUpdateCitation) {
            onUpdateCitation(citation);
            toast.success("Citation updated!");
        } else if (onAddCitation) {
            onAddCitation(citation);
            toast.success("Citation added!");
        }

        onOpenChange(false);

        if (!editingCitation) {
            setFormData({
                type: "website",
                style: "APA",
                authors: "",
                title: "",
                source: "",
                year: "",
                url: "",
                doi: "",
                isbn: "",
                publisher: "",
                volume: "",
                issue: "",
                pages: "",
                accessDate: "",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl! max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{editingCitation ? "Edit Citation" : "Add New Citation"}</DialogTitle>
                    <DialogDescription>
                        {editingCitation
                            ? "Update the citation details below"
                            : "Enter citation details manually or use quick auto-fill"}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea hideScrollbar className="max-h-[calc(90vh-120px)]">
                    {!editingCitation && (
                        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <Label className="text-sm font-semibold">Quick Auto-Fill</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Enter a website URL, ISBN, or DOI to automatically populate citation details
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com or ISBN or DOI"
                                    value={autoFillInput}
                                    onChange={(e) => setAutoFillInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAutoFill()}
                                />
                                <Button
                                    onClick={handleAutoFill}
                                    disabled={isAutoFilling}
                                    variant="outline"
                                    type="button"
                                >
                                    {isAutoFilling ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading
                                        </>
                                    ) : (
                                        "Auto-Fill"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    <CitationFormFields
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onCancel={() => onOpenChange(false)}
                        isEditing={!!editingCitation}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
