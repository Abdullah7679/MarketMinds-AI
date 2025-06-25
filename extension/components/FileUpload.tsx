import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileVideo } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onCancel }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supportedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json'
  ];
  
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return FileVideo;
    return File;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleFileSelect = (file: File) => {
    if (!supportedTypes.includes(file.type)) {
      alert('Unsupported file type. Please select an image, video, PDF, or text file.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB.');
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };
  
  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : Upload;
  
  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        <div className="upload-header">
          <h3>Upload File</h3>
          <button className="close-upload" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        
        <div className="upload-content">
          <div
            className={`upload-area ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={supportedTypes.join(',')}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
            <div className="upload-icon">
              <FileIcon size={48} style={{
                color: selectedFile ? '#00D4FF' : '#666'
              }} />
            </div>
            
            {selectedFile ? (
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-details">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </div>
              </div>
            ) : (
              <div className="upload-text">
                <p>Drag and drop a file here, or click to select</p>
                <p className="upload-subtitle">
                  Supports images, videos, PDFs, and text files (max 10MB)
                </p>
              </div>
            )}
          </div>
          
          <div className="supported-formats">
            <h4>Supported Formats:</h4>
            <div className="format-list">
              <span>Images: JPEG, PNG, GIF, WebP</span>
              <span>Videos: MP4, WebM</span>
              <span>Documents: PDF, TXT, CSV, JSON</span>
            </div>
          </div>
        </div>
        
        <div className="upload-actions">
          <button className="upload-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="upload-button upload"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Analyze File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
