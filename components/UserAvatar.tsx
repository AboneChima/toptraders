'use client';

import { useAuthStore } from '@/store/authStore';

interface UserAvatarProps {
  onClick?: () => void;
}

export default function UserAvatar({ onClick }: UserAvatarProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center"
      >
        <span className="text-white font-semibold text-sm">?</span>
      </button>
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform"
    >
      <span className="text-white font-semibold text-sm">{initials}</span>
    </button>
  );
}
