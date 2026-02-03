import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onDismiss,
  duration = 4000,
}) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const icon = type === 'success' ? '✓' : '!';

  return (
    <div
      role="alert"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] ${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px] max-w-[90vw] transition-opacity duration-200`}
    >
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
