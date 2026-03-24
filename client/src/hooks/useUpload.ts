import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocx } from '../api/client';
import { usePageStore } from '../store/pageStore';

const STAGES = [
  'Parsing document...',
  'Analyzing structure...',
  'Generating layout...',
  'Done!',
];

export function useUpload() {
  const navigate = useNavigate();
  const addToast = usePageStore((s) => s.addToast);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!file.name.endsWith('.docx')) {
      setError('Only .docx files are accepted');
      return;
    }
    setError(null);
    setUploading(true);
    setStage(STAGES[0]);
    setProgress(10);

    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, STAGES.length - 2);
      setStage(STAGES[stageIdx]);
      setProgress(10 + stageIdx * 25);
    }, 2500);

    try {
      const res = await uploadDocx(file);
      clearInterval(stageInterval);
      setStage(STAGES[3]);
      setProgress(100);
      addToast('Page created successfully!', 'success');
      setTimeout(() => navigate(`/editor/${res.data.pageId}`), 600);
    } catch (err: any) {
      clearInterval(stageInterval);
      const msg = err.response?.data?.error || 'Upload failed. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, stage, progress, error };
}
