"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { GoalCard, CreateGoalModal } from "./_components/";
import { Button } from "@/components/ui/button";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface CheckIn {
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  currentStreak: number;
  longestStreak: number;
  tasks: Task[];
  checkInHistory: CheckIn[];
  lastCheckInDate?: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("goals");
    if (saved) setGoals(JSON.parse(saved));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals, isMounted]);

  const createGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: goalData.title || "New Goal",
      description: goalData.description || "",
      startDate: goalData.startDate || new Date().toISOString(),
      duration: goalData.duration || 30,
      currentStreak: 0,
      longestStreak: 0,
      tasks: [],
      checkInHistory: [],
      ...goalData,
    };
    setGoals([...goals, newGoal]);
    setIsModalOpen(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => [...prev.filter((p) => p.id !== goalId)]);
  };

  const handleCheckIn = (goalId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;

        const history = [...goal.checkInHistory, { date: today }];
        const lastDate = goal.lastCheckInDate;
        let newStreak = goal.currentStreak;

        if (!lastDate) newStreak = 1;
        else {
          const last = new Date(lastDate);
          const current = new Date(today);
          const diff =
            (current.getTime() - last.getTime()) / (1000 * 3600 * 24);

          if (diff === 1) newStreak += 1;
          else if (diff > 1) newStreak = 1;
        }

        return {
          ...goal,
          checkInHistory: history,
          lastCheckInDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, goal.longestStreak),
        };
      })
    );
  };

  if (!isMounted) return null;

  return (
    <main className="container p-6 md:p-12 mx-auto px-4 flex flex-col gap-12">
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border-2 border-dashed border-border rounded-lg bg-card/30">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#4a3a2a]">
              Welcome to your focus.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start by creating your first goal. Small steps lead to big change.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity font-medium"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-full border-2 border-dashed border-[#8a9a5b]/40 rounded-sm flex flex-col items-center justify-center hover:bg-[#8a9a5b]/5 transition-all group gap-4"
            type="button"
            variant="ghost"
          >
            <div className="size-12 rounded-full border border-[#8a9a5b]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="size-6 text-[#8a9a5b]" />
            </div>
            <span className="text-sm font-medium text-[#8a9a5b]">
              New Focus
            </span>
          </Button>

          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onCheckIn={handleCheckIn}
              onDeleteGoal={deleteGoal}
            />
          ))}
        </div>
      )}

      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createGoal}
      />
    </main>
  );
}
