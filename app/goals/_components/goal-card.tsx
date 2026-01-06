"use client";

import Link from "next/link";
import { Flame, CheckCircle2, ArrowRight, X } from "lucide-react";
import type { Goal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GoalCardProps {
  goal: Goal;
  onCheckIn: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalCard({ goal, onCheckIn, onDeleteGoal }: GoalCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const isCheckedInToday = goal.lastCheckInDate === today;
  const completedTasks = goal.tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const totalTasks = goal.tasks.length;

  return (
    <Card className="group relative bg-[#e8dec0] border-[#c9ba96] shadow-sm rounded-sm flex flex-col transition-all hover:shadow-md h-full overflow-hidden p-0 gap-0">
      <div className="h-8 flex items-center justify-between px-3 border-b border-[#c9ba96]/50">
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGoal(goal.id);
            }}
            className="group relative w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center hover:bg-[#ff5f56]/90 transition-colors"
          >
            <X className="size-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
      </div>

      <div className="p-6 flex flex-col h-full gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-serif text-[#4a3a2a] leading-tight group-hover:text-[#8a9a5b] transition-colors">
            {goal.title}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#8a9a5b]/10 rounded-full">
            <Flame
              className={cn(
                "w-4 h-4",
                goal.currentStreak > 0
                  ? "text-[#e0443e]"
                  : "text-muted-foreground"
              )}
            />
            <span className="text-xs font-bold text-[#4a3a2a]">
              {goal.currentStreak}
            </span>
          </div>
        </div>

        <div className="flex-1 max-sm:text-sm text-[#4a3a2a]/70 line-clamp-2">
          {goal.description || "No description provided."}
        </div>

        <div className="pt-4 border-t border-[#c9ba96]/50 flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            {completedTasks}/{totalTasks} tasks done
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                if (!isCheckedInToday) onCheckIn(goal.id);
              }}
              disabled={isCheckedInToday}
              className={cn(
                "rounded-full transition-all",
                isCheckedInToday
                  ? "bg-[#8a9a5b] text-white hover:bg-[#8a9a5b]"
                  : "bg-white/50 text-[#8a9a5b] hover:bg-[#8a9a5b]/10"
              )}
            >
              <CheckCircle2 className="w-5 h-5" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/50 text-[#4a3a2a] hover:bg-[#4a3a2a]/10 transition-all"
            >
              <Link href={`/goals/${goal.id}`}>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
