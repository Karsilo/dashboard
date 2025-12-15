import { Citation, CitationStyle } from '@/types/citation';

function formatAuthors(authors: string[], style: CitationStyle): string {
  if (authors.length === 0) return '';

  switch (style) {
    case 'APA':
      if (authors.length === 1) {
        return authors[0];
      } else if (authors.length === 2) {
        return `${authors[0]}, & ${authors[1]}`;
      } else if (authors.length <= 20) {
        const allButLast = authors.slice(0, -1).join(', ');
        return `${allButLast}, & ${authors[authors.length - 1]}`;
      } else {
        return authors.slice(0, 19).join(', ') + ', ... ' + authors[authors.length - 1];
      }

    case 'MLA':
      if (authors.length === 1) {
        return authors[0];
      } else if (authors.length === 2) {
        return `${authors[0]}, and ${authors[1]}`;
      } else {
        return `${authors[0]}, et al`;
      }

    case 'Chicago':
      if (authors.length === 1) {
        return authors[0];
      } else if (authors.length === 2) {
        return `${authors[0]} and ${authors[1]}`;
      } else if (authors.length === 3) {
        return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
      } else {
        return `${authors[0]} et al`;
      }

    case 'IEEE':
      if (authors.length === 1) {
        return authors[0];
      } else if (authors.length <= 6) {
        const allButLast = authors.slice(0, -1).join(', ');
        return `${allButLast}, and ${authors[authors.length - 1]}`;
      } else {
        return `${authors[0]} et al`;
      }

    case 'OSCOLA':
      if (authors.length === 1) {
        return authors[0];
      } else if (authors.length === 2) {
        return `${authors[0]} and ${authors[1]}`;
      } else if (authors.length === 3) {
        return `${authors[0]}, ${authors[1]} and ${authors[2]}`;
      } else {
        return `${authors[0]} and others`;
      }

    default:
      return authors.join(', ');
  }
}

export function formatCitation(citation: Citation, style: CitationStyle): string {
  const authors = formatAuthors(citation.authors, style);

  switch (style) {
    case 'APA':
      return formatAPA(citation, authors);
    case 'MLA':
      return formatMLA(citation, authors);
    case 'Chicago':
      return formatChicago(citation, authors);
    case 'IEEE':
      return formatIEEE(citation, authors);
    case 'OSCOLA':
      return formatOSCOLA(citation, authors);
    default:
      return '';
  }
}

function formatAPA(citation: Citation, authors: string): string {
  let formatted = authors ? `${authors}. ` : '';
  formatted += citation.year ? `(${citation.year}). ` : '';
  formatted += citation.title ? `<em>${citation.title}</em>. ` : '';

  if (citation.type === 'journal') {
    formatted += citation.source ? `<em>${citation.source}</em>` : '';
    formatted += citation.volume ? `, ${citation.volume}` : '';
    formatted += citation.issue ? `(${citation.issue})` : '';
    formatted += citation.pages ? `, ${citation.pages}` : '';
    formatted += '. ';
  } else if (citation.type === 'book') {
    formatted += citation.publisher ? `${citation.publisher}. ` : '';
  } else {
    formatted += citation.source ? `${citation.source}. ` : '';
  }

  if (citation.doi) {
    formatted += `https://doi.org/${citation.doi}`;
  } else if (citation.url) {
    formatted += citation.url;
  }

  return formatted;
}

function formatMLA(citation: Citation, authors: string): string {
  let formatted = authors ? `${authors}. ` : '';
  formatted += citation.title ? `"${citation.title}." ` : '';
  formatted += citation.source ? `<em>${citation.source}</em>` : '';

  if (citation.type === 'journal') {
    formatted += citation.volume ? `, vol. ${citation.volume}` : '';
    formatted += citation.issue ? `, no. ${citation.issue}` : '';
    formatted += citation.year ? `, ${citation.year}` : '';
    formatted += citation.pages ? `, pp. ${citation.pages}` : '';
  } else {
    formatted += citation.publisher ? `, ${citation.publisher}` : '';
    formatted += citation.year ? `, ${citation.year}` : '';
  }

  if (citation.url) {
    formatted += `, ${citation.url}`;
    if (citation.accessDate) {
      formatted += `. Accessed ${citation.accessDate}`;
    }
  }

  formatted += '.';
  return formatted;
}

function formatChicago(citation: Citation, authors: string): string {
  let formatted = authors ? `${authors}. ` : '';

  if (citation.type === 'book') {
    formatted += citation.title ? `<em>${citation.title}</em>. ` : '';
    formatted += citation.publisher ? `${citation.publisher}, ` : '';
    formatted += citation.year ? `${citation.year}. ` : '';
  } else if (citation.type === 'journal') {
    formatted += citation.title ? `"${citation.title}." ` : '';
    formatted += citation.source ? `<em>${citation.source}</em> ` : '';
    formatted += citation.volume ? `${citation.volume}` : '';
    formatted += citation.issue ? `, no. ${citation.issue}` : '';
    formatted += citation.year ? ` (${citation.year})` : '';
    formatted += citation.pages ? `: ${citation.pages}` : '';
    formatted += '. ';
  } else {
    formatted += citation.title ? `"${citation.title}." ` : '';
    formatted += citation.source ? `${citation.source}. ` : '';
    formatted += citation.year ? `${citation.year}. ` : '';
  }

  if (citation.url) {
    formatted += citation.url;
    if (citation.accessDate) {
      formatted += `. Accessed ${citation.accessDate}`;
    }
    formatted += '.';
  }

  return formatted;
}

function formatIEEE(citation: Citation, authors: string): string {
  let formatted = authors ? `${authors}, ` : '';
  formatted += citation.title ? `"${citation.title}," ` : '';
  formatted += citation.source ? `<em>${citation.source}</em>` : '';

  if (citation.type === 'journal') {
    formatted += citation.volume ? `, vol. ${citation.volume}` : '';
    formatted += citation.issue ? `, no. ${citation.issue}` : '';
    formatted += citation.pages ? `, pp. ${citation.pages}` : '';
    formatted += citation.year ? `, ${citation.year}` : '';
  } else {
    formatted += citation.publisher ? `, ${citation.publisher}` : '';
    formatted += citation.year ? `, ${citation.year}` : '';
  }

  if (citation.doi) {
    formatted += `, doi: ${citation.doi}`;
  } else if (citation.url) {
    formatted += `. [Online]. Available: ${citation.url}`;
    if (citation.accessDate) {
      formatted += `. [Accessed: ${citation.accessDate}]`;
    }
  }

  formatted += '.';
  return formatted;
}

function formatOSCOLA(citation: Citation, authors: string): string {
  let formatted = authors ? `${authors}, ` : '';

  if (citation.type === 'book') {
    formatted += citation.title ? `<em>${citation.title}</em> ` : '';
    formatted += citation.publisher ? `(${citation.publisher} ` : '(';
    formatted += citation.year ? `${citation.year})` : ')';
  } else if (citation.type === 'journal') {
    formatted += citation.title ? `'${citation.title}' ` : '';
    formatted += citation.year ? `(${citation.year}) ` : '';
    formatted += citation.volume ? `${citation.volume} ` : '';
    formatted += citation.source ? `<em>${citation.source}</em>` : '';
    formatted += citation.pages ? ` ${citation.pages}` : '';
  } else {
    formatted += citation.title ? `'${citation.title}' ` : '';
    formatted += citation.source ? `(${citation.source}` : '(';
    formatted += citation.year ? `, ${citation.year})` : ')';
  }

  if (citation.url) {
    formatted += ` <${citation.url}>`;
    if (citation.accessDate) {
      formatted += ` accessed ${citation.accessDate}`;
    }
  }

  return formatted;
}
