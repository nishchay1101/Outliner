import { create } from 'zustand';
import { PageJSON, PageSummary, Block } from '../../../shared/types';

interface PageStore {
  pages: PageSummary[];
  activePage: PageJSON | null;
  editMode: boolean;
  editingBlockId: string | null;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];

  setPages: (pages: PageSummary[]) => void;
  setActivePage: (page: PageJSON | null) => void;
  updateActivePageBlocks: (blocks: Block[]) => void;
  updateActivePageTitle: (title: string) => void;
  toggleEditMode: () => void;
  setEditMode: (v: boolean) => void;
  setEditingBlockId: (id: string | null) => void;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, data: Record<string, any>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  pages: [],
  activePage: null,
  editMode: false,
  editingBlockId: null,
  toasts: [],

  setPages: (pages) => set({ pages }),
  setActivePage: (page) => set({ activePage: page }),
  updateActivePageBlocks: (blocks) =>
    set((s) => s.activePage ? { activePage: { ...s.activePage, blocks } } : {}),
  updateActivePageTitle: (title) =>
    set((s) => s.activePage ? { activePage: { ...s.activePage, title } } : {}),
  toggleEditMode: () => set((s) => ({ editMode: !s.editMode, editingBlockId: null })),
  setEditMode: (v) => set({ editMode: v }),
  setEditingBlockId: (id) => set({ editingBlockId: id }),
  addBlock: (block) =>
    set((s) => {
      if (!s.activePage) return {};
      const blocks = [...s.activePage.blocks, { ...block, order: s.activePage.blocks.length }];
      return { activePage: { ...s.activePage, blocks } };
    }),
  updateBlock: (id, data) =>
    set((s) => {
      if (!s.activePage) return {};
      const blocks = s.activePage.blocks.map((b) =>
        b.id === id ? { ...b, data } : b
      );
      return { activePage: { ...s.activePage, blocks } };
    }),
  deleteBlock: (id) =>
    set((s) => {
      if (!s.activePage) return {};
      const blocks = s.activePage.blocks
        .filter((b) => b.id !== id)
        .map((b, i) => ({ ...b, order: i }));
      return { activePage: { ...s.activePage, blocks } };
    }),
  reorderBlocks: (blocks) =>
    set((s) => s.activePage ? { activePage: { ...s.activePage, blocks } } : {}),
  addToast: (message, type = 'info') =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now().toString(), message, type }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
