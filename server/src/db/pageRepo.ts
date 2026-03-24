import { getDb } from './schema';
import { PageJSON, PageSummary } from '../../../shared/types';

export function getAllPages(): PageSummary[] {
  const db = getDb();
  const rows = db.prepare(
    'SELECT id, title, source_filename, created_at, updated_at FROM pages ORDER BY updated_at DESC'
  ).all() as any[];
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    sourceFilename: r.source_filename,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export function getPageById(id: string): PageJSON | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as any;
  if (!row) return null;
  return JSON.parse(row.content_json) as PageJSON;
}

export function createPage(page: PageJSON): PageJSON {
  const db = getDb();
  db.prepare(`
    INSERT INTO pages (id, title, source_filename, content_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(page.id, page.title, page.sourceFilename, JSON.stringify(page), page.createdAt, page.updatedAt);
  return page;
}

export function updatePage(id: string, updates: Partial<PageJSON>): PageJSON | null {
  const existing = getPageById(id);
  if (!existing) return null;
  const updated: PageJSON = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  const db = getDb();
  db.prepare(`
    UPDATE pages SET title = ?, content_json = ?, updated_at = ? WHERE id = ?
  `).run(updated.title, JSON.stringify(updated), updated.updatedAt, id);
  return updated;
}

export function deletePage(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM pages WHERE id = ?').run(id);
  return result.changes > 0;
}
