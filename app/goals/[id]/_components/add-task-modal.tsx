"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Topic, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskModalProps {
  topics: Topic[];
  onAddTask: (task: Task) => void;
}

export function AddTaskModal({ topics, onAddTask }: AddTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");
  const [status, setStatus] = useState<"pending" | "completed" | "in-progress">(
    "pending"
  );
  const [note, setNote] = useState("");

  const selectedTopic = topics.find((t) => t.id === topicId);
  const subtopics = selectedTopic?.subtopics || [];

  const handleSubmit = () => {
    if (!title.trim() || !topicId) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      topicId,
      subtopicId: subtopicId || undefined,
      status,
      note: note.trim() || undefined,
    };

    onAddTask(newTask);
    setTitle("");
    setTopicId("");
    setSubtopicId("");
    setStatus("pending");
    setNote("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#8a9a5b] text-white rounded-sm font-bold uppercase tracking-widest text-[10px] hover:bg-[#8a9a5b]/90 shadow-sm"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#e8dec0] border border-[#c9ba96]">
        <DialogHeader>
          <DialogTitle className="text-[#4a3a2a] font-serif text-xl">
            Add New Task
          </DialogTitle>
          <DialogDescription className="text-[#4a3a2a]/60">
            Create a new task for this goal with topic, status, and optional
            notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a] block mb-2">
              Task Title*
            </label>
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-[#c9ba96] focus-visible:ring-[#8a9a5b]"
            />
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <div className="w-full">
              <label className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a] block mb-2">
                Topic*
              </label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger className="bg-secondary border-[#c9ba96] w-full">
                  <SelectValue placeholder="Select a topic..." />
                </SelectTrigger>
                <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                  {topics.length === 0 ? (
                    <div className="text-center py-4 text-sm text-[#4a3a2a]/60">
                      No topics yet. Create one to add tasks.
                    </div>
                  ) : (
                    topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {subtopics.length > 0 && (
              <div className="w-full">
                <label className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a] block mb-2">
                  Subtopic
                </label>
                <Select value={subtopicId} onValueChange={setSubtopicId}>
                  <SelectTrigger className="bg-secondary border-[#c9ba96] w-full">
                    <SelectValue placeholder="Select a subtopic..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                    <SelectItem value="none">None</SelectItem>
                    {subtopics.map((subtopic) => (
                      <SelectItem key={subtopic.id} value={subtopic.id}>
                        {subtopic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a] block mb-2">
              Status
            </label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="bg-secondary border-[#c9ba96]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a] block mb-2">
              Note (Optional)
            </label>
            <Textarea
              placeholder="Add any additional notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-secondary border-[#c9ba96] focus-visible:ring-[#8a9a5b] resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !topicId}
              className="bg-[#8a9a5b] text-white rounded-sm font-bold hover:bg-[#8a9a5b]/90"
            >
              Add Task
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-[#c9ba96] hover:bg-[#c9ba96]/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
