"use client";

import LoadingLink from "./LoadingLink";

export default function Footer() {
  return (
    <div
      className="sticky bottom-0 z-40 w-full border-b px-4 py-3 backdrop-blur-md"
      style={{ background: "#455411" }}
    >
      <div className="mx-auto flex items-center justify-end gap-3">
        <LoadingLink
          className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20"
          href="/privacy"
        >
          Privacy
        </LoadingLink>
        <LoadingLink
          className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20"
          href="/terms"
        >
          Terms
        </LoadingLink>
        <LoadingLink
          className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20"
          href="/disclaimer"
        >
          Disclaimer
        </LoadingLink>
        <LoadingLink
          className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20"
          href="/community-guidelines"
        >
          Guidelines
        </LoadingLink>
      </div>
    </div>
  );
}
