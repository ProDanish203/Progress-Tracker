"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import type { Topic, Subtopic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TopicManagerProps {
  topics: Topic[];
  onAddTopic: (topic: Topic) => void;
  onAddSubtopic: (topicId: string, subtopic: Subtopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onDeleteSubtopic: (topicId: string, subtopicId: string) => void;
}

export function TopicManager({
  topics,
  onAddTopic,
  onAddSubtopic,
  onDeleteTopic,
  onDeleteSubtopic,
}: TopicManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [newSubtopicName, setNewSubtopicName] = useState("");

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  const handleAddTopic = (e: FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTopicName.trim(),
      subtopics: [],
    };

    onAddTopic(newTopic);
    setNewTopicName("");
    if (topics.length === 0) setSelectedTopicId(newTopic.id);
  };

  const handleAddSubtopic = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTopicId || !newSubtopicName.trim()) return;

    const newSubtopic: Subtopic = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubtopicName.trim(),
    };

    onAddSubtopic(selectedTopicId, newSubtopic);
    setNewSubtopicName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#c9ba96] hover:bg-[#c9ba96]/20 text-[#4a3a2a] bg-transparent w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Topics
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#e8dec0] border border-[#c9ba96] max-h-125 overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-[#4a3a2a] font-serif text-xl">
            Manage Topics
          </DialogTitle>
          <DialogDescription className="text-[#4a3a2a]/60">
            Add and organize topics and subtopics for your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Topic */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a]">
              Topics
            </h3>
            <form className="flex gap-2" onSubmit={handleAddTopic}>
              <Input
                placeholder="New topic name..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="bg-secondary border-[#c9ba96]"
              />
              <Button
                type="submit"
                disabled={!newTopicName.trim()}
                className="bg-[#8a9a5b] text-white rounded-sm hover:bg-[#8a9a5b]/90"
                size="sm"
              >
                Add
              </Button>
            </form>

            {/* Topics List */}
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center justify-between p-3 border border-[#c9ba96]/30 rounded-sm cursor-pointer transition-colors ${
                    selectedTopicId === topic.id
                      ? "bg-[#8a9a5b]/20 border-[#8a9a5b]"
                      : "hover:bg-white/30"
                  }`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <span className="text-sm font-medium text-[#4a3a2a]">
                    {topic.name}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTopic(topic.id);
                      if (selectedTopicId === topic.id) setSelectedTopicId("");
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#e0443e] hover:bg-[#e0443e]/10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Subtopic */}
          {selectedTopic && (
            <div className="space-y-3 border-t border-[#c9ba96] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3a2a]">
                Subtopics of "{selectedTopic.name}"
              </h3>
              <form className="flex gap-2" onSubmit={handleAddSubtopic}>
                <Input
                  placeholder="New subtopic name..."
                  value={newSubtopicName}
                  onChange={(e) => setNewSubtopicName(e.target.value)}
                  className="bg-secondary border-[#c9ba96]"
                />
                <Button
                  type="submit"
                  disabled={!newSubtopicName.trim()}
                  className="bg-[#8a9a5b] text-white rounded-sm hover:bg-[#8a9a5b]/90"
                  size="sm"
                >
                  Add
                </Button>
              </form>

              {/* Subtopics List */}
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {selectedTopic.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="flex items-center justify-between p-3 bg-white/20 border border-[#c9ba96]/30 rounded-sm"
                  >
                    <span className="text-sm font-medium text-[#4a3a2a]">
                      {subtopic.name}
                    </span>
                    <Button
                      onClick={() =>
                        onDeleteSubtopic(selectedTopic.id, subtopic.id)
                      }
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 text-[#e0443e] hover:bg-[#e0443e]/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
