"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Calendar,
  Target,
  Trash,
} from "lucide-react";
import type { Goal, Task, Topic, Subtopic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTaskModal, ImportTasksModal, TopicManager } from "./_components";

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [filterTopic, setFilterTopic] = useState("");
  const [filterSubtopic, setFilterSubtopic] = useState("");

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
      setGoal(updatedGoal);
    }
  };

  const updateTaskStatus = (
    taskId: string,
    newStatus: "pending" | "completed" | "in-progress"
  ) => {
    if (!goal) return;
    const updatedTasks = goal.tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    saveGoal({ ...goal, tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    if (!goal) return;
    saveGoal({ ...goal, tasks: goal.tasks.filter((t) => t.id !== taskId) });
  };

  const handleAddTask = (task: Task) => {
    if (!goal) return;
    saveGoal({ ...goal, tasks: [...goal.tasks, task] });
  };

  const handleImportTasks = (tasks: Task[], topics: Topic[]) => {
    if (!goal) return;
    saveGoal({
      ...goal,
      tasks: [...goal.tasks, ...tasks],
      topics,
    });
  };

  const handleAddTopic = (topic: Topic) => {
    if (!goal) return;
    saveGoal({ ...goal, topics: [...goal.topics, topic] });
  };

  const handleAddSubtopic = (topicId: string, subtopic: Subtopic) => {
    if (!goal) return;
    const updatedTopics = goal.topics.map((t) =>
      t.id === topicId ? { ...t, subtopics: [...t.subtopics, subtopic] } : t
    );
    saveGoal({ ...goal, topics: updatedTopics });
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!goal) return;
    saveGoal({
      ...goal,
      topics: goal.topics.filter((t) => t.id !== topicId),
      tasks: goal.tasks.filter((t) => t.topicId !== topicId),
    });
  };

  const handleDeleteSubtopic = (topicId: string, subtopicId: string) => {
    if (!goal) return;
    const updatedTopics = goal.topics.map((t) =>
      t.id === topicId
        ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== subtopicId) }
        : t
    );
    saveGoal({
      ...goal,
      topics: updatedTopics,
      tasks: goal.tasks.map((t) =>
        t.subtopicId === subtopicId ? { ...t, subtopicId: undefined } : t
      ),
    });
  };

  const filteredTasks = useMemo(() => {
    return (
      goal?.tasks.filter((task) => {
        const topicMatch =
          !filterTopic || task.topicId === filterTopic || filterTopic === "all";
        const subtopicMatch =
          !filterSubtopic ||
          task.subtopicId === filterSubtopic ||
          filterSubtopic === "all";
        return topicMatch && subtopicMatch;
      }) || []
    );
  }, [filterTopic, filterSubtopic, goal]);

  const getTopicName = (topicId: string) => {
    return goal?.topics.find((t) => t.id === topicId)?.name || "Unknown";
  };

  const getSubtopicName = (topicId: string, subtopicId?: string) => {
    if (!subtopicId) return "-";
    return (
      goal?.topics
        .find((t) => t.id === topicId)
        ?.subtopics.find((s) => s.id === subtopicId)?.name || "Unknown"
    );
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
  const completedTasks = goal.tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const totalTasks = goal.tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  const selectedTopic = goal.topics.find((t) => t.id === filterTopic);
  const subtopicsForFilter = selectedTopic?.subtopics || [];

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <p className="text-[#4a3a2a]/60 font-medium tracking-tight mt-1">
            {goal.description}
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a3a2a]/40">
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
        {/* Heatmap - Full Width */}
        <section className="bg-[#e8dec0] border border-[#c9ba96] rounded-sm p-8 shadow-sm space-y-8">
          <div className="flex justify-between items-center max-sm:flex-col gap-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a3a2a]/40">
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9a5b]">
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

        {/* Tasks Section - Full Width */}
        <section className="bg-[#e8dec0] border border-[#c9ba96] rounded-sm p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a3a2a]/40">
                Tasks
              </h2>
              <span className="text-[10px] font-bold text-[#8a9a5b] uppercase tracking-widest">
                {filteredTasks.length}/{totalTasks}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap max-sm:flex-col">
              <AddTaskModal topics={goal.topics} onAddTask={handleAddTask} />
              <div className="flex items-center max-sm:justify-between gap-2">
                <div className="w-full">
                  <ImportTasksModal
                    topics={goal.topics}
                    goal={goal}
                    onImportTasks={handleImportTasks}
                  />
                </div>
                <div className="w-full">
                  <TopicManager
                    topics={goal.topics}
                    onAddTopic={handleAddTopic}
                    onAddSubtopic={handleAddSubtopic}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteSubtopic={handleDeleteSubtopic}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="bg-secondary border-[#c9ba96] w-full sm:w-48">
                <SelectValue placeholder="Filter by Topic" />
              </SelectTrigger>
              <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                <SelectItem value="all">All Topics</SelectItem>
                {goal.topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {subtopicsForFilter.length > 0 && (
              <Select value={filterSubtopic} onValueChange={setFilterSubtopic}>
                <SelectTrigger className="bg-secondary border-[#c9ba96] w-full sm:w-48">
                  <SelectValue placeholder="Filter by Subtopic" />
                </SelectTrigger>
                <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                  <SelectItem value="all">All Subtopics</SelectItem>
                  {subtopicsForFilter.map((subtopic) => (
                    <SelectItem key={subtopic.id} value={subtopic.id}>
                      {subtopic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tasks Table */}
          <div className="border border-[#c9ba96]/30 rounded-sm overflow-hidden">
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-[#c9ba96]/10 sticky top-0 z-10">
                  <TableRow className="border-[#c9ba96]/30 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest text-[#4a3a2a]/40 font-bold">
                      Title
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-[#4a3a2a]/40 font-bold">
                      Topic
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-[#4a3a2a]/40 font-bold">
                      Subtopic
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-[#4a3a2a]/40 font-bold">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-[#4a3a2a]/40 font-bold">
                      Note
                    </TableHead>
                    <TableHead className="w-16 text-right text-[10px] uppercase tracking-widest text-[#4a3a2a]/40">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow className="border-[#c9ba96]/30">
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-[#4a3a2a]/30 italic text-sm"
                      >
                        No tasks found...
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="border-[#c9ba96]/20 group hover:bg-[#c9ba96]/5"
                      >
                        <TableCell>
                          <span className="text-sm font-medium text-[#4a3a2a]">
                            {task.title}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#4a3a2a]/70">
                            {getTopicName(task.topicId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#4a3a2a]/70">
                            {getSubtopicName(task.topicId, task.subtopicId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={task.status}
                            onValueChange={(val: any) =>
                              updateTaskStatus(task.id, val)
                            }
                          >
                            <SelectTrigger className="h-8 w-32 bg-secondary border-[#c9ba96] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#4a3a2a]/60 truncate max-w-xs">
                            {task.note || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash size={4} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
