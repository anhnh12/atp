import React, { useState, KeyboardEvent } from 'react';
import { FiX } from 'react-icons/fi';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = "Nhập tag và nhấn Enter, Tab hoặc dấu phẩy" }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if user typed a comma
    if (value.includes(',')) {
      const parts = value.split(',');
      // Add all parts except the last one (which is still being typed)
      parts.slice(0, -1).forEach(part => {
        if (part.trim()) {
          addTag(part);
        }
      });
      // Keep the last part in the input
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent min-h-[42px]">
        {/* Tag chips */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        {/* Input field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Nhấn Enter, Tab hoặc dấu phẩy để thêm tag
      </p>
    </div>
  );
};

export default TagInput;
