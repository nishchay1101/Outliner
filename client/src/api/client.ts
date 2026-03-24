import axios from 'axios';
import { PageJSON, PageSummary, Block } from '../../../shared/types';

const api = axios.create({ baseURL: '/api' });

export const uploadDocx = (file: File, onProgress?: (stage: string) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  if (onProgress) onProgress('Parsing document...');
  return api.post<{ pageId: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getPages = () => api.get<PageSummary[]>('/pages');
export const getPage = (id: string) => api.get<PageJSON>(`/pages/${id}`);
export const createPage = (title: string) => api.post<PageJSON>('/pages', { title });
export const updatePage = (id: string, data: Partial<PageJSON>) => api.patch<PageJSON>(`/pages/${id}`, data);
export const deletePage = (id: string) => api.delete(`/pages/${id}`);
export const exportPage = (id: string) => api.post(`/pages/${id}/export`, {}, { responseType: 'blob' });
export const extendWithAI = (prompt: string, contextBlocks: Block[]) =>
  api.post<Block>('/ai/extend', { prompt, contextBlocks });
