"use client";

import { Plus } from "lucide-react";

interface StickyCardInputProps {
  onClick: () => void;
}

export function StickyCardInput({ onClick }: StickyCardInputProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-square border-2 border-dashed border-primary/60 rounded-sm flex items-center justify-center hover:bg-primary/10 transition-all group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full border border-[#8a9a5b]/40 flex items-center justify-center group-hover:scale-110 transition-transform bg-background/50">
        <Plus className="w-6 h-6 text-[#8a9a5b]" />
      </div>
    </button>
  );
}
