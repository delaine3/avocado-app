"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

type Props = {
  displayName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
  initial: string;
  onLogout: () => void;
};

export default function ProfileDropdown({
  displayName,
  userEmail,
  avatarUrl,
  initial,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded px-3 py-1 text-white hover:bg-white/20"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName ?? "Profile"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 font-bold text-[#455411]">
            {initial}
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="truncate text-sm font-semibold">{displayName}</p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 w-60 rounded bg-white p-2 shadow-xl text-[#4a2c14]">
          <div className="px-3 py-2 border-b text-sm">
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs opacity-60 truncate">{userEmail}</p>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-[#bed582]/40"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
