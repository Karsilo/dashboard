"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, FileArchive, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { compressFile } from "@/utils/file-compressor";

interface CompressedFile {
    id: string;
    originalFile: File;
    compressedBlob?: Blob;
    originalSize: number;
    compressedSize?: number;
    status: "pending" | "compressing" | "completed" | "error";
    error?: string;
}

const Page = () => {
    const [files, setFiles] = useState<CompressedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (selectedFiles: File[]) => {
        const validExtensions = [
            ".pdf", ".doc", ".docx", ".pptx", ".ppt",
            ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"
        ];

        const newFiles: CompressedFile[] = selectedFiles
            .filter(file => {
                const ext = "." + file.name.split(".").pop()?.toLowerCase();
                return validExtensions.includes(ext);
            })
            .map(file => ({
                id: Math.random().toString(36).substring(7),
                originalFile: file,
                originalSize: file.size,
                status: "pending" as const,
            }));

        if (newFiles.length < selectedFiles.length) {
            toast.error("Some files were skipped. Only PDFs, documents, and images are supported.");
        }

        setFiles(prev => [...prev, ...newFiles]);

        newFiles.forEach(file => compressFileHandler(file));
    };

    const compressFileHandler = async (file: CompressedFile) => {
        setFiles(prev =>
            prev.map(f => (f.id === file.id ? { ...f, status: "compressing" as const } : f))
        );

        try {
            const result = await compressFile(file.originalFile);

            setFiles(prev =>
                prev.map(f =>
                    f.id === file.id
                        ? {
                            ...f,
                            compressedBlob: result.blob,
                            compressedSize: result.size,
                            status: "completed" as const,
                        }
                        : f
                )
            );

            const savingsPercent = ((1 - result.size / file.originalSize) * 100).toFixed(1);
            toast.success(`Compressed ${file.originalFile.name} - Saved ${savingsPercent}%`);
        } catch (error) {
            setFiles(prev =>
                prev.map(f =>
                    f.id === file.id
                        ? {
                            ...f,
                            status: "error" as const,
                            error: error instanceof Error ? error.message : "Compression failed",
                        }
                        : f
                )
            );
            toast.error(`Failed to compress ${file.originalFile.name}`);
        }
    };

    const handleDownload = (file: CompressedFile) => {
        if (!file.compressedBlob) return;

        const url = URL.createObjectURL(file.compressedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_${file.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("File downloaded successfully");
    };

    const handleDownloadAll = () => {
        const completedFiles = files.filter(f => f.status === "completed" && f.compressedBlob);

        completedFiles.forEach(file => {
            handleDownload(file);
        });

        toast.success(`Downloaded ${completedFiles.length} compressed files`);
    };

    const handleRemove = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleClear = () => {
        setFiles([]);
        toast.success("Cleared all files");
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const completedCount = files.filter(f => f.status === "completed").length;
    const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
    const totalCompressedSize = files.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
    const totalSavings = totalOriginalSize > 0
        ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)
        : "0";

    return (
        <div className="space-y-6">
            <div>
                <p className="text-muted-foreground mt-2">
                    Compress PDFs, documents, and images to reduce file size
                </p>
            </div>

            <Card
                className={`border-2 border-dashed transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Upload className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium mb-2">
                        Drag and drop files here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        or click to browse
                    </p>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.pptx,.ppt,.png,.jpg,.jpeg,.gif,.bmp,.webp"
                        onChange={handleFileInput}
                    />
                    <Button asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <FileArchive className="mr-2 h-4 w-4" />
                            Select Files
                        </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                        Supported: PDF, DOC, DOCX, PPTX, PNG, JPG, GIF, BMP, WEBP
                    </p>
                </CardContent>
            </Card>

            {files.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">
                                Files ({files.length})
                            </h3>
                            {completedCount > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Total savings: {formatFileSize(totalOriginalSize - totalCompressedSize)} ({totalSavings}%)
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleClear} variant="outline" size="sm">
                                Clear All
                            </Button>
                            {completedCount > 0 && (
                                <Button onClick={handleDownloadAll} size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download All ({completedCount})
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {files.map(file => (
                            <Card key={file.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {file.originalFile.name}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>
                                                    Original: {formatFileSize(file.originalSize)}
                                                </span>
                                                {file.compressedSize && (
                                                    <>
                                                        <span>→</span>
                                                        <span className="text-green-600 font-medium">
                                                            Compressed: {formatFileSize(file.compressedSize)}
                                                        </span>
                                                        <span className="text-green-600">
                                                            ({((1 - file.compressedSize / file.originalSize) * 100).toFixed(1)}% saved)
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {file.status === "error" && file.error && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {file.error}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {file.status === "compressing" && (
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            )}
                                            {file.status === "completed" && (
                                                <Button
                                                    onClick={() => handleDownload(file)}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleRemove(file.id)}
                                                size="sm"
                                                variant="ghost"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
