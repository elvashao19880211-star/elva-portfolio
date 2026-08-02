'use client';

import { useState, useCallback } from 'react';
import { isFavorite, toggleFavorite, type FavoriteItem } from '@/lib/userData';

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
  onToggle?: (added: boolean) => void;
}

export default function FavoriteButton({ item, className = '', onToggle }: FavoriteButtonProps) {
  const [liked, setLiked] = useState(() => isFavorite(item.id));

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const added = toggleFavorite(item);
      setLiked(added);
      onToggle?.(added);
    },
    [item]
  );

  return (
    <button
      onClick={handleClick}
      title={liked ? '取消收藏' : '加入收藏'}
      className={`transition-all duration-200 ${className}`}
    >
      {liked ? (
        <svg className="w-5 h-5 text-red-400 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-300 hover:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
}
