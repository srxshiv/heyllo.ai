'use client';

import { signOut } from '@/lib/actions/auth.action';

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut()} className="text-sm font-medium">
      Logout
    </button>
  );
};
