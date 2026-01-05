"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCardProps {
  id: string;
  content: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export function StickyCard({
  id,
  content,
  onDelete,
  onUpdate,
}: StickyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(id, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative w-full aspect-square bg-[#e8dec0] border border-[#c9ba96] shadow-sm rounded-sm flex flex-col transition-shadow",
        isDragging && "opacity-50 shadow-xl cursor-grabbing",
        !isDragging && "cursor-default"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="h-8 flex items-center justify-between px-3 border-b border-[#c9ba96]/50 cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="group relative w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center hover:bg-[#ff5f56]/90 transition-colors"
          >
            <X className="size-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-hidden scrollbar-thin"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            autoFocus
            className="w-full h-full bg-transparent resize-none border-none outline-none text-foreground font-serif leading-relaxed text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
          />
        ) : (
          <p className="text-foreground text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
            {content || "Double click to edit..."}
          </p>
        )}
      </div>
    </div>
  );
}
