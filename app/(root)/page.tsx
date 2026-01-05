"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { StickyCard, StickyCardInput } from "./_components";

interface Note {
  id: string;
  content: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes, isMounted]);

  const addNote = () => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      content: "",
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
        <StickyCardInput onClick={addNote} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notes.map((n) => n.id)}
            strategy={rectSortingStrategy}
          >
            {notes.map((note) => (
              <StickyCard
                key={note.id}
                id={note.id}
                content={note.content}
                onDelete={deleteNote}
                onUpdate={updateNote}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
