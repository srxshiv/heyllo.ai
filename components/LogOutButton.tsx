// LogOutButton.tsx
'use client';

import { signOut } from '@/lib/actions/auth.action';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="text-sm font-medium px-4 py-2 rounded-lg bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md text-indigo-600 hover:text-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
    >
      Logout
    </button>
  );
};