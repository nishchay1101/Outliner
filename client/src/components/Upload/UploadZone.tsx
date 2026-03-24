import { useRef, useState, DragEvent } from 'react';
import { useUpload } from '../../hooks/useUpload';
import './UploadZone.css';

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

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          className="upload-input-hidden"
          onChange={handleFileChange}
        />

        {!uploading ? (
          <>
            <div className="upload-icon">📄</div>
            <p className="upload-file-name">
              {selectedFile ? selectedFile.name : 'Drop your .docx file here'}
            </p>
            <p className="upload-file-meta">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB — click Upload to convert`
                : 'or click to browse — .docx files only'}
            </p>
          </>
        ) : (
          <div className="upload-progress-container">
            <p className="upload-progress-stage">
              {stage}
            </p>
            <div className="upload-progress-bar-bg">
              <div
                className="upload-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="upload-error-msg">
          ✗ {error}
        </p>
      )}

      {selectedFile && !uploading && (
        <button className="btn btn-primary upload-submit-btn" onClick={handleUpload}>
          Convert with Claude →
        </button>
      )}
    </div>
  );
}
