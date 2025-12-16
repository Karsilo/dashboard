'use client';

/**
 * File compression utilities supporting various file types
 */

// Dynamic imports for browser-only libraries
let pdfjsLib: typeof import('pdfjs-dist') | null = null;
let jsPDF: typeof import('jspdf').jsPDF | null = null;

// Initialize PDF.js on client side only
async function initPdfJs() {
    if (typeof window === 'undefined') return;

    if (!pdfjsLib) {
        pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    if (!jsPDF) {
        const jsPdfModule = await import('jspdf');
        jsPDF = jsPdfModule.jsPDF;
    }
}

interface CompressionResult {
    blob: Blob;
    size: number;
}

/**
 * Compress an image file using canvas
 */
async function compressImage(file: File, quality: number = 0.7): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                // Calculate scale factor for compression
                const maxDimension = 1920;
                let scaleFactor = 1;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        scaleFactor = maxDimension / width;
                    } else {
                        scaleFactor = maxDimension / height;
                    }
                    width = Math.floor(width * scaleFactor);
                    height = Math.floor(height * scaleFactor);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, width, height);

                // Convert PNG to JPEG for better compression
                // Keep other formats as-is but use quality parameter
                const isPNG = file.type === "image/png";
                const outputType = isPNG ? "image/jpeg" : file.type;
                const outputQuality = quality;

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // If compressed size is larger, return original
                            if (blob.size >= file.size) {
                                resolve({ blob: file, size: file.size });
                            } else {
                                resolve({ blob, size: blob.size });
                            }
                        } else {
                            reject(new Error("Failed to compress image"));
                        }
                    },
                    outputType,
                    outputQuality
                );
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

/**
 * Compress a PDF file using PDF.js and jsPDF
 * Converts PDF pages to images at reduced quality, then rebuilds the PDF
 */
async function compressPDF(file: File, quality: number = 0.7): Promise<CompressionResult> {
    try {
        // Initialize PDF libraries
        await initPdfJs();

        if (!pdfjsLib || !jsPDF) {
            throw new Error('PDF libraries not available');
        }

        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF with PDF.js
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        // Create a new jsPDF document
        let newPdf: InstanceType<typeof jsPDF> | null = null;

        // Process each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            // Create canvas for rendering
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Failed to get canvas context');
            }

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render page to canvas
            await page.render({
                canvasContext: context,
                canvas: canvas,
                viewport: viewport,
            }).promise;

            // Convert canvas to compressed image
            const imageData = canvas.toDataURL('image/jpeg', quality);

            // Convert viewport dimensions from pixels to mm (PDF standard)
            const pdfWidth = viewport.width * 0.264583; // px to mm
            const pdfHeight = viewport.height * 0.264583;

            // Create or add page to PDF
            if (!newPdf) {
                newPdf = new jsPDF({
                    orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight],
                    compress: true,
                });
            } else {
                newPdf.addPage([pdfWidth, pdfHeight], pdfWidth > pdfHeight ? 'landscape' : 'portrait');
            }

            // Add image to PDF
            newPdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }

        if (!newPdf) {
            throw new Error('Failed to create PDF');
        }

        // Convert to blob
        const blob = newPdf.output('blob');

        // If compressed size is larger or similar, return original
        if (blob.size >= file.size * 0.95) {
            return { blob: file, size: file.size };
        }

        return { blob, size: blob.size };
    } catch (error) {
        console.error('PDF compression error:', error);
        // If compression fails, return original file
        return { blob: file, size: file.size };
    }
}

/**
 * Compress a document file (DOC, DOCX, PPTX)
 * Note: True compression of these formats requires backend processing
 * This returns the original file as client-side compression is limited
 */
async function compressDocument(file: File): Promise<CompressionResult> {
    // Documents are already compressed (ZIP format)
    // Return original file
    const blob = new Blob([file], { type: file.type });
    return { blob, size: file.size };
}

/**
 * Main compression function that routes to appropriate handler
 */
export async function compressFile(file: File): Promise<CompressionResult> {
    const extension = file.name.split(".").pop()?.toLowerCase();

    // Image files
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    if (extension && imageExtensions.includes(extension)) {
        return compressImage(file);
    }

    // PDF files
    if (extension === "pdf") {
        return compressPDF(file);
    }

    // Document files
    const docExtensions = ["doc", "docx", "pptx", "ppt", "xlsx", "xls"];
    if (extension && docExtensions.includes(extension)) {
        return compressDocument(file);
    }

    throw new Error(`Unsupported file type: ${extension}`);
}

/**
 * Compress multiple files
 */
export async function compressFiles(files: File[]): Promise<CompressionResult[]> {
    const compressionPromises = files.map(file => compressFile(file));
    return Promise.all(compressionPromises);
}
