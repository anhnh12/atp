import React, { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxSizeLabel?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_LABEL = '5MB';

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  maxSize = DEFAULT_MAX_SIZE,
  maxSizeLabel = DEFAULT_MAX_LABEL,
  label = 'Hình ảnh',
  hint,
  disabled = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const valid: File[] = [];
    const oversized: string[] = [];
    for (const file of files) {
      if (file.size > maxSize) {
        oversized.push(file.name);
      } else {
        valid.push(file);
      }
    }
    if (oversized.length > 0) {
      setError(`Một số file vượt quá ${maxSizeLabel}: ${oversized.join(', ')}`);
    } else {
      setError(null);
    }
    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) inputRef.current.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200' : ''}
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <FiUploadCloud className={`w-10 h-10 mx-auto mb-2 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive ? 'Thả file vào đây' : 'Kéo thả file vào đây hoặc nhấn để chọn'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {hint ?? `Nhiều file. Tối đa ${maxSizeLabel} mỗi file.`}
        </p>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUploadZone;
