"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CitationFormData, CitationType, CitationStyle } from "@/types/citation";
import { Badge } from "@/components/ui/badge";

interface CitationFormFieldsProps {
    formData: CitationFormData;
    setFormData: React.Dispatch<React.SetStateAction<CitationFormData>>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function CitationFormFields({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isEditing = false,
}: CitationFormFieldsProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Citation Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value: CitationType) =>
                            setFormData({ ...formData, type: value })
                        }
                    >
                        <SelectTrigger id="type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="book">Book</SelectItem>
                            <SelectItem value="journal">Journal Article</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="style">Citation Style</Label>
                    <Select
                        value={formData.style}
                        onValueChange={(value: CitationStyle) =>
                            setFormData({ ...formData, style: value })
                        }
                    >
                        <SelectTrigger id="style">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="APA">
                                <div className="flex items-center gap-2">
                                    <span>APA</span>
                                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                                </div>
                            </SelectItem>
                            <SelectItem value="MLA">MLA (Humanities)</SelectItem>
                            <SelectItem value="Chicago">Chicago (History)</SelectItem>
                            <SelectItem value="IEEE">IEEE (Technical)</SelectItem>
                            <SelectItem value="OSCOLA">OSCOLA (Legal)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="authors">
                    Author(s) <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="authors"
                    placeholder="Last, First; Last, First"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Separate multiple authors with semicolons
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    placeholder="Title of the work"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="source">
                    Source/Publisher <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="source"
                    placeholder="Journal name, website name, or publisher"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year">
                        Year <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="year"
                        placeholder="2024"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                        id="publisher"
                        placeholder="Publisher name"
                        value={formData.publisher}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="doi">DOI</Label>
                    <Input
                        id="doi"
                        placeholder="10.1000/xyz"
                        value={formData.doi}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                        id="isbn"
                        placeholder="978-0-123456-78-9"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accessDate">Access Date</Label>
                    <Input
                        id="accessDate"
                        placeholder="January 1, 2024"
                        value={formData.accessDate}
                        onChange={(e) =>
                            setFormData({ ...formData, accessDate: e.target.value })
                        }
                    />
                </div>
            </div>

            {formData.type === "journal" && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="volume">Volume</Label>
                        <Input
                            id="volume"
                            placeholder="12"
                            value={formData.volume}
                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="issue">Issue</Label>
                        <Input
                            id="issue"
                            placeholder="3"
                            value={formData.issue}
                            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pages">Pages</Label>
                        <Input
                            id="pages"
                            placeholder="123-145"
                            value={formData.pages}
                            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                    {isEditing ? "Update Citation" : "Add Citation"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
