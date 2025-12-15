export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'OSCOLA';

export type CitationType = 'website' | 'book' | 'journal' | 'other';

export interface Citation {
  id: string;
  type: CitationType;
  style: CitationStyle;
  authors: string[];
  title: string;
  source: string;
  year: string;
  url?: string;
  doi?: string;
  isbn?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  accessDate?: string;
  createdAt: number;
}

export interface CitationFormData {
  type: CitationType;
  style: CitationStyle;
  authors: string;
  title: string;
  source: string;
  year: string;
  url?: string;
  doi?: string;
  isbn?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  accessDate?: string;
}
