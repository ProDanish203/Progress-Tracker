"use client";

import { useState } from "react";
import type { Goal } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (goal: Partial<Goal>) => void;
}

export function CreateGoalModal({
  isOpen,
  onClose,
  onCreate,
}: CreateGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);

  return (
    <Credenza open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CredenzaContent className="md:max-w-md bg-[#e8dec0] border-[#c9ba96] p-0 overflow-hidden">
        <CredenzaHeader className="h-12 flex items-center justify-between px-3 border-b border-[#c9ba96]/50 bg-[#d6c9a3]/50 py-3 max-sm:-my-6">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"
            />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <CredenzaTitle className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a]/60">
            New Focus
          </CredenzaTitle>
          <div className="w-12" />
        </CredenzaHeader>

        <form
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate({
              title,
              description,
              duration,
              startDate: new Date().toISOString(),
            });
            setTitle("");
            setDescription("");
          }}
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text">
              Title
            </label>
            <Input
              required
              autoFocus
              className="bg-transparent border-t-0 border-x-0 border-b border-[#c9ba96] focus-visible:ring-0 focus-visible:border-[#8a9a5b] rounded-none py-2 text-lg font-serif px-0 h-auto shadow-none"
              placeholder="e.g. Daily Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text">
              Description
            </label>
            <Textarea
              className="bg-transparent border-[#c9ba96] focus-visible:ring-0 focus-visible:border-[#8a9a5b] p-3 text-sm min-h-25 max-h-44 scrollbar-thin resize-none rounded-sm shadow-none"
              placeholder="What's the motivation behind this goal?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4a3a2a]/60">
              Duration (Days)
            </label>
            <Select
              value={String(duration)}
              onValueChange={(val) => setDuration(Number(val))}
            >
              <SelectTrigger className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#c9ba96] focus-visible:ring-0 focus-visible:border-[#8a9a5b] rounded-none px-0 h-auto py-2 shadow-none">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CredenzaFooter className="flex gap-4 pt-4 sm:justify-between">
            <CredenzaClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-[#4a3a2a]/60 hover:text-[#4a3a2a] hover:bg-transparent"
              >
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              type="submit"
              className="flex-1 py-3 bg-[#8a9a5b] text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-[#8a9a5b]/90 shadow-sm"
            >
              Create Focus
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}
