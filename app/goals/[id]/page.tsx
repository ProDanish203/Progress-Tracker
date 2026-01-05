"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Calendar,
  Target,
  Plus,
  Trash2,
} from "lucide-react";
import type { Goal, Task } from "../page";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("goals");
    if (saved) {
      const goals: Goal[] = JSON.parse(saved);
      const found = goals.find((g) => g.id === id);
      if (found) setGoal(found);
    }
    setIsMounted(true);
  }, [id]);

  const saveGoal = (updatedGoal: Goal) => {
    if (typeof window === "undefined") return;
    setGoal(updatedGoal);
    const saved = localStorage.getItem("goals");
    if (saved) {
      const goals: Goal[] = JSON.parse(saved);
      const updatedGoals = goals.map((g) => (g.id === id ? updatedGoal : g));
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
    }
  };

  const toggleTask = (taskId: string) => {
    if (!goal) return;
    const updatedTasks = goal.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveGoal({ ...goal, tasks: updatedTasks });
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !newTaskName.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTaskName,
      completed: false,
    };
    saveGoal({ ...goal, tasks: [...goal.tasks, newTask] });
    setNewTaskName("");
  };

  const deleteTask = (taskId: string) => {
    if (!goal) return;
    saveGoal({ ...goal, tasks: goal.tasks.filter((t) => t.id !== taskId) });
  };

  const handleCheckIn = () => {
    if (!goal) return;
    const today = new Date().toISOString().split("T")[0];
    if (goal.lastCheckInDate === today) return;

    const history = [...goal.checkInHistory, { date: today }];
    let newStreak = goal.currentStreak;

    if (!goal.lastCheckInDate) {
      newStreak = 1;
    } else {
      const last = new Date(goal.lastCheckInDate);
      const current = new Date(today);
      const diff = (current.getTime() - last.getTime()) / (1000 * 3600 * 24);

      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    }

    saveGoal({
      ...goal,
      checkInHistory: history,
      lastCheckInDate: today,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, goal.longestStreak),
    });
  };

  if (!isMounted || !goal) return null;

  const today = new Date().toISOString().split("T")[0];
  const isCheckedInToday = goal.lastCheckInDate === today;
  const completedTasks = goal.tasks.filter((t) => t.completed).length;
  const totalTasks = goal.tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calendar Heatmap Generation
  const startDate = new Date(goal.startDate);
  const calendarDays = Array.from({ length: goal.duration }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const isPast = date < new Date(today);
    const isToday = dateStr === today;
    const checkedIn = goal.checkInHistory.some((h) => h.date === dateStr);
    return { dateStr, isPast, isToday, checkedIn };
  });

  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center gap-6">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full border-[#c9ba96] hover:bg-[#c9ba96]/20 text-[#4a3a2a] bg-transparent"
        >
          <Link href="/goals">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-serif text-[#4a3a2a]">{goal.title}</h1>
          <p className="text-[#4a3a2a]/60 font-medium tracking-tight mt-1 line-clamp-2">
            {goal.description} lorem100
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Streak",
            value: goal.currentStreak,
            icon: Flame,
            color: "text-orange-600",
          },
          {
            label: "Best",
            value: goal.longestStreak,
            icon: Trophy,
            color: "text-yellow-600",
          },
          {
            label: "Progress",
            value: `${completionRate}%`,
            icon: Target,
            color: "text-blue-600",
          },
          {
            label: "Remaining",
            value: goal.duration,
            icon: Calendar,
            color: "text-green-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#e8dec0] border border-[#c9ba96] rounded-sm p-4 flex flex-col gap-1 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-text">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-serif text-[#4a3a2a]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-12">
        {/* Heatmap & Check-in - Now Full Width */}
        <section className="bg-[#e8dec0] border border-[#c9ba96] rounded-sm p-8 shadow-sm space-y-8">
          <div className="flex justify-between sm:items-center max-sm:flex-col gap-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text max-sm:text-center">
              Consistency Map
            </h2>
            {!isCheckedInToday && (
              <Button
                onClick={handleCheckIn}
                size="sm"
                className="bg-[#8a9a5b] text-white rounded-sm font-bold uppercase tracking-widest text-[10px] hover:bg-[#8a9a5b]/90 shadow-sm px-6"
              >
                Log Today
              </Button>
            )}
            {isCheckedInToday && (
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Logged for Today ✓
              </span>
            )}
          </div>
          <TooltipProvider>
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-30 xl:grid-cols-35 gap-2">
              {calendarDays.map((day, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "aspect-square rounded-[2px] border transition-all duration-300 cursor-help",
                        day.checkedIn
                          ? "bg-[#8a9a5b] border-[#6d7a48] scale-105"
                          : day.isPast
                          ? "bg-[#c9ba96]/30 border-transparent"
                          : "bg-white/40 border-[#c9ba96]/30",
                        day.isToday &&
                          !day.checkedIn &&
                          "ring-2 ring-[#ffbd2e] ring-offset-2 ring-offset-[#e8dec0]"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#4a3a2a] text-[#e8dec0] border-[#4a3a2a]">
                    {day.dateStr} {day.checkedIn ? "✓" : ""}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </section>

        {/* Tasks Section - Now Full Width with Table */}
        <section className="bg-[#e8dec0] border border-[#c9ba96] rounded-sm sm:px-8 px-4 py-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="max-sm:text-xs font-bold uppercase tracking-[0.2em] text-text">
              Daily Tasks
            </h2>
            <div className="flex items-center gap-4">
              <span className="sm:text-xs text-[10px] font-bold text-primary uppercase tracking-widest">
                {completedTasks}/{totalTasks} COMPLETED
              </span>
            </div>
          </div>

          <div className="relative border border-[#c9ba96]/30 rounded-sm overflow-hidden">
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-secondary sticky top-0 z-10">
                  <TableRow className="border-[#c9ba96]/30 hover:bg-transparent">
                    <TableHead className="w-12 text-center text-xs uppercase tracking-widest text-primary font-extrabold">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest text-primary font-extrabold">
                      Task Description
                    </TableHead>
                    <TableHead className="w-20 text-right text-xs uppercase tracking-widest text-primary font-extrabold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goal.tasks.length === 0 ? (
                    <TableRow className="border-[#c9ba96]/30">
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-text italic max-sm:text-sm text-lg"
                      >
                        No daily tasks added yet...
                      </TableCell>
                    </TableRow>
                  ) : (
                    goal.tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="border-secondary group hover:bg-secondary/40"
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="border-[#c9ba96] data-[state=checked]:bg-[#8a9a5b] data-[state=checked]:border-[#8a9a5b]"
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "text-sm font-medium transition-all",
                              task.completed
                                ? "text-text/10 line-through"
                                : "text-text"
                            )}
                          >
                            {task.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 text-[#e0443e] hover:bg-[#e0443e]/10 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <form
            onSubmit={addTask}
            className="flex items-center gap-4 bg-white/10 p-4 rounded-sm border border-[#c9ba96]/30 shadow-inner"
          >
            <Plus className="w-4 h-4 text-primary" />
            <Input
              type="text"
              placeholder="Add a new daily commitment..."
              className="bg-transparent max-sm:text-sm text-lg flex-1 border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-text font-medium rounded-none"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="text-xs max-sm:hidden font-bold uppercase tracking-widest text-text"
              disabled={!newTaskName.trim()}
            >
              Add Task
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
