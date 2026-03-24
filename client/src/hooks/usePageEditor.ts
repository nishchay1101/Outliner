import { useCallback } from 'react';
import { usePageStore } from '../store/pageStore';
import { updatePage } from '../api/client';
import { Block } from '../../../shared/types';

export function usePageEditor() {
  const { activePage, addToast } = usePageStore((s) => ({
    activePage: s.activePage,
    addToast: s.addToast,
  }));

  const save = useCallback(async () => {
    if (!activePage) return;
    try {
      await updatePage(activePage.id, {
        title: activePage.title,
        blocks: activePage.blocks,
      });
      addToast('Saved!', 'success');
    } catch {
      addToast('Save failed', 'error');
    }
  }, [activePage, addToast]);

  const saveBlock = useCallback(
    async (blockId: string, data: Record<string, any>) => {
      if (!activePage) return;
      const blocks = activePage.blocks.map((b: Block) =>
        b.id === blockId ? { ...b, data } : b
      );
      try {
        await updatePage(activePage.id, { blocks });
        usePageStore.getState().updateBlock(blockId, data);
        addToast('Block saved', 'success');
      } catch {
        addToast('Failed to save block', 'error');
      }
    },
    [activePage, addToast]
  );

  return { save, saveBlock };
}
