import { useRef, useState, DragEvent } from 'react';
import { useUpload } from '../../hooks/useUpload';

export function UploadZone() {
  const { upload, uploading, stage, progress, error } = useUpload();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setSelectedFile(file); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) upload(selectedFile);
  };

  const zoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '4px',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: dragOver ? 'rgba(244,197,66,0.04)' : 'transparent',
  };

  return (
    <div style={{ maxWidth: '520px', width: '100%' }}>
      <div
        style={zoneStyle}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {!uploading ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {selectedFile ? selectedFile.name : 'Drop your .docx file here'}
            </p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB — click Upload to convert`
                : 'or click to browse — .docx files only'}
            </p>
          </>
        ) : (
          <div style={{ padding: '1rem 0' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1rem' }}>
              {stage}
            </p>
            <div style={{ background: 'var(--border)', borderRadius: '2px', height: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--accent)',
                  width: `${progress}%`,
                  transition: 'width 0.4s ease',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--accent2)', marginTop: '0.75rem', padding: '0.5rem 0.75rem', border: '1px solid var(--accent2)', borderRadius: '2px' }}>
          ✗ {error}
        </p>
      )}

      {selectedFile && !uploading && (
        <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={handleUpload}>
          Convert with Claude →
        </button>
      )}
    </div>
  );
}
