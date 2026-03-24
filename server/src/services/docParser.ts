import mammoth from 'mammoth';
import { DocContent, DocSection, DocTable } from '../../../shared/types';

export async function parseDocx(filePath: string): Promise<DocContent> {
  const result = await mammoth.extractRawText({ path: filePath });
  const htmlResult = await mammoth.convertToHtml({ path: filePath });

  const rawText = result.value;
  const html = htmlResult.value;

  const sections = extractSections(rawText);
  const tables = extractTablesFromHtml(html);
  const lists = extractLists(html);

  return { rawText, sections, tables, lists };
}

function extractSections(text: string): DocSection[] {
  const lines = text.split('\n').filter(l => l.trim());
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;
  let contentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Detect headings by: ALL CAPS, short lines, lines ending with colon, numbered patterns
    const isHeading = (
      (trimmed.length < 80 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) ||
      /^#+\s/.test(trimmed) ||
      /^\d+[\.\)]\s+[A-Z]/.test(trimmed) ||
      (trimmed.endsWith(':') && trimmed.length < 60 && !trimmed.includes('.'))
    );

    if (isHeading) {
      if (currentSection) {
        currentSection.content = contentLines.join('\n').trim();
        sections.push(currentSection);
        contentLines = [];
      }
      const level = detectHeadingLevel(trimmed);
      currentSection = { level, title: trimmed.replace(/^#+\s/, '').replace(/:$/, ''), content: '' };
    } else {
      if (currentSection) {
        contentLines.push(trimmed);
      } else {
        // text before first heading goes into a default section
        currentSection = { level: 1, title: 'Introduction', content: '' };
        contentLines.push(trimmed);
      }
    }
  }
  if (currentSection) {
    currentSection.content = contentLines.join('\n').trim();
    sections.push(currentSection);
  }
  return sections.filter(s => s.title || s.content);
}

function detectHeadingLevel(text: string): number {
  if (/^#\s/.test(text)) return 1;
  if (/^##\s/.test(text)) return 2;
  if (/^###\s/.test(text)) return 3;
  if (text === text.toUpperCase()) return 1;
  if (/^\d+[\.\)]\s/.test(text)) return 2;
  return 2;
}

function extractTablesFromHtml(html: string): DocTable[] {
  const tables: DocTable[] = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1];
    const rows: string[][] = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      const cells: string[] = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
      }
      if (cells.length > 0) rows.push(cells);
    }

    if (rows.length > 0) {
      tables.push({ headers: rows[0], rows: rows.slice(1) });
    }
  }
  return tables;
}

function extractLists(html: string): string[][] {
  const lists: string[][] = [];
  const listRegex = /<[uo]l[^>]*>([\s\S]*?)<\/[uo]l>/gi;
  let listMatch;

  while ((listMatch = listRegex.exec(html)) !== null) {
    const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const items: string[] = [];
    let itemMatch;
    while ((itemMatch = itemRegex.exec(listMatch[1])) !== null) {
      items.push(itemMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    if (items.length > 0) lists.push(items);
  }
  return lists;
}
