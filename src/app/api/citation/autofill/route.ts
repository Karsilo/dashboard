import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { input, type } = await request.json();

        if (!input) {
            return NextResponse.json({ error: 'Input is required' }, { status: 400 });
        }

        let metadata;

        if (type === 'url' || (!type && input.startsWith('http'))) {
            metadata = await fetchWebsiteMetadata(input);
        } else if (type === 'isbn' || (!type && /^[\d-]+$/.test(input))) {
            metadata = await fetchISBNMetadata(input);
        } else if (type === 'doi' || (!type && input.includes('doi.org'))) {
            metadata = await fetchDOIMetadata(input);
        } else {
            return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
        }

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Auto-fill error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metadata' },
            { status: 500 }
        );
    }
}

async function fetchWebsiteMetadata(url: string) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch website');
        }

        const html = await response.text();

        const getMetaContent = (property: string): string | undefined => {
            const regex = new RegExp(
                `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
                'i'
            );
            const match = html.match(regex);
            return match ? match[1] : undefined;
        };

        const getTitleFromTag = (): string | undefined => {
            const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
            return match ? match[1].trim() : undefined;
        };

        const title =
            getMetaContent('og:title') ||
            getMetaContent('twitter:title') ||
            getTitleFromTag() ||
            '';

        const author =
            getMetaContent('author') ||
            getMetaContent('article:author') ||
            getMetaContent('og:article:author') ||
            '';

        const siteName =
            getMetaContent('og:site_name') ||
            getMetaContent('twitter:site') ||
            new URL(url).hostname.replace('www.', '') ||
            '';

        const publishedDate =
            getMetaContent('article:published_time') ||
            getMetaContent('datePublished') ||
            '';

        const year = publishedDate
            ? new Date(publishedDate).getFullYear().toString()
            : new Date().getFullYear().toString();

        return {
            type: 'website',
            title,
            authors: author ? [author] : [],
            source: siteName,
            year,
            url,
            accessDate: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
        };
    } catch (error) {
        console.error('Error fetching website metadata:', error);
        return {
            type: 'website',
            url,
            accessDate: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
        };
    }
}

async function fetchISBNMetadata(isbn: string) {
    try {
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        const response = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch ISBN data');
        }

        const data = await response.json();
        const bookData = data[`ISBN:${cleanISBN}`];

        if (!bookData) {
            return { type: 'book', isbn };
        }

        return {
            type: 'book',
            title: bookData.title || '',
            authors: bookData.authors?.map((a: any) => a.name) || [],
            publisher: bookData.publishers?.[0]?.name || '',
            year: bookData.publish_date
                ? new Date(bookData.publish_date).getFullYear().toString()
                : '',
            isbn: cleanISBN,
            source: bookData.publishers?.[0]?.name || '',
        };
    } catch (error) {
        console.error('Error fetching ISBN metadata:', error);
        return { type: 'book', isbn };
    }
}

async function fetchDOIMetadata(doi: string) {
    try {
        const cleanDOI = doi.includes('doi.org/')
            ? doi.split('doi.org/')[1]
            : doi;

        const response = await fetch(`https://api.crossref.org/works/${cleanDOI}`);

        if (!response.ok) {
            throw new Error('Failed to fetch DOI data');
        }

        const data = await response.json();
        const work = data.message;

        return {
            type: 'journal',
            title: work.title?.[0] || '',
            authors:
                work.author?.map(
                    (a: any) => `${a.family || ''}, ${a.given || ''}`.trim()
                ) || [],
            source: work['container-title']?.[0] || '',
            year: work.published?.['date-parts']?.[0]?.[0]?.toString() || '',
            doi: cleanDOI,
            volume: work.volume || '',
            issue: work.issue || '',
            pages: work.page || '',
            publisher: work.publisher || '',
        };
    } catch (error) {
        console.error('Error fetching DOI metadata:', error);
        return { type: 'journal', doi };
    }
}
