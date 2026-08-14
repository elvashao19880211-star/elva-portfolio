'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface LightboxProps {
  src: string;
  title: string;
  onClose: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
}

export default function Lightbox({ src, title, onClose, onDownload, downloadLabel }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-all z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative max-w-[92vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[92vw] h-[80vh]">
          <Image
            src={src}
            alt={title}
            fill
            className="object-contain rounded-lg shadow-2xl"
            sizes="92vw"
          />
        </div>
        {(title || onDownload) && (
          <div className="mt-4 flex flex-col items-center gap-3">
            {title && <p className="text-white/80 text-center text-sm font-serif">{title}</p>}
            {onDownload && (
              <button
                onClick={onDownload}
                className="px-6 py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors shadow-lg"
              >
                {downloadLabel || '下载无水印图'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
