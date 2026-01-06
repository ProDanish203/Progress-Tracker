"use client";

import type React from "react";

import { useState } from "react";
import { Upload, ChevronRight, ChevronLeft } from "lucide-react";
import * as XLSX from "xlsx";
import type { Goal, Subtopic, Task, Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

interface ColumnMapping {
  [key: string]: string;
}

interface ImportTasksModalProps {
  topics: Topic[];
  goal: Goal;
  onImportTasks: (tasks: Task[], topics: Topic[]) => void;
}

export function ImportTasksModal({
  topics,
  goal,
  onImportTasks,
}: ImportTasksModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [rawData, setRawData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);

  const requiredColumns = ["Title", "Topic"];
  const optionalColumns = ["Status", "Subtopic", "Note"];
  const allColumns = [...requiredColumns, ...optionalColumns];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target?.result as ArrayBuffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        toast.error("No data found in the Excel file");
        return;
      }

      const columns = Object.keys(data[0] || {});
      setDetectedColumns(columns);
      setRawData(data);
      initializeMapping(columns);
      setStep(2);
    };

    reader.readAsArrayBuffer(file);
  };

  const initializeMapping = (columns: string[]) => {
    const newMapping: ColumnMapping = {};
    allColumns.forEach((col) => {
      const foundCol = columns.find(
        (c) => c.toLowerCase() === col.toLowerCase()
      );
      newMapping[col] = foundCol || "";
    });
    setMapping(newMapping);
  };

  const handleMappingChange = (targetCol: string, sourceCol: string) => {
    setMapping((prev) => ({
      ...prev,
      [targetCol]: sourceCol,
    }));
  };

  const validateMapping = () => {
    return requiredColumns.every((col) => mapping[col]);
  };

  const importTasks = () => {
    if (!goal) return;

    const tasksToImport: Task[] = [];
    const updatedTopics = [...goal.topics];

    rawData.forEach((row) => {
      const title = row[mapping.Title]?.toString().trim();
      const topicName = row[mapping.Topic]?.toString().trim();
      const status = row[mapping.Status]?.toString().toLowerCase() || "pending";
      const subtopicName = mapping.Subtopic
        ? row[mapping.Subtopic]?.toString().trim()
        : undefined;
      const note = mapping.Note
        ? row[mapping.Note]?.toString().trim()
        : undefined;

      if (!title || !topicName) return;

      // Find or create topic
      let topic = updatedTopics.find(
        (t) => t.name.toLowerCase() === topicName.toLowerCase()
      );

      if (!topic) {
        topic = {
          id: Math.random().toString(36).substr(2, 9),
          name: topicName.trim(),
          subtopics: [],
        };
        updatedTopics.push(topic);
      }

      let subtopicId: string | undefined;
      if (subtopicName) {
        let subtopic = topic.subtopics.find(
          (s) => s.name.toLowerCase() === subtopicName.toLowerCase()
        );

        if (!subtopic) {
          subtopic = {
            id: Math.random().toString(36).substr(2, 9),
            name: subtopicName.trim(),
          };
          topic.subtopics.push(subtopic);
        }
        subtopicId = subtopic.id;
      }

      const validStatus = ["pending", "in-progress", "completed"].includes(
        status
      )
        ? (status as "pending" | "in-progress" | "completed")
        : "pending";

      tasksToImport.push({
        id: Math.random().toString(36).substr(2, 9),
        title,
        topicId: topic.id,
        subtopicId,
        status: validStatus,
        note: note || undefined,
      });
    });

    onImportTasks(tasksToImport, updatedTopics);

    toast.success(`Successfully imported ${tasksToImport.length} tasks`);

    setIsOpen(false);
    setStep(1);
    setRawData([]);
    setMapping({});
    setDetectedColumns([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#c9ba96] hover:bg-[#c9ba96]/20 text-[#4a3a2a] bg-transparent w-full"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#e8dec0] border border-[#c9ba96]">
        <DialogHeader>
          <DialogTitle className="text-[#4a3a2a] font-serif text-xl">
            Import Tasks from Excel
          </DialogTitle>
          <DialogDescription className="text-[#4a3a2a]/60">
            {step === 1
              ? "Select an Excel file to import tasks"
              : "Map your Excel columns to task fields"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <div className="border-2 border-dashed border-[#c9ba96] rounded-sm p-8 text-center cursor-pointer hover:bg-[#c9ba96]/10 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-8 h-8 text-[#8a9a5b]" />
                <div>
                  <p className="font-medium text-[#4a3a2a]">
                    Drop your Excel file here
                  </p>
                  <p className="text-xs text-[#4a3a2a]/60 mt-1">
                    .xlsx, .xls, or .csv files are supported
                  </p>
                </div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 border border-[#c9ba96] rounded-sm p-4 space-y-4">
                <h3 className="font-semibold text-[#4a3a2a] text-sm">
                  Column Mapping
                </h3>

                <div className="space-y-3">
                  {requiredColumns.map((col) => (
                    <div key={col} className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase text-[#4a3a2a] min-w-20">
                        {col} *
                      </span>
                      <Select
                        value={mapping[col]}
                        onValueChange={(v) => handleMappingChange(col, v)}
                      >
                        <SelectTrigger className="bg-secondary border-[#c9ba96] flex-1">
                          <SelectValue placeholder="Select column..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                          {detectedColumns.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  {optionalColumns.map((col) => (
                    <div key={col} className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase text-[#4a3a2a] min-w-20">
                        {col}
                      </span>
                      <Select
                        value={mapping[col] || "None"}
                        onValueChange={(v) => handleMappingChange(col, v)}
                      >
                        <SelectTrigger className="bg-secondary border-[#c9ba96] flex-1">
                          <SelectValue placeholder="Select column..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#e8dec0] border-[#c9ba96]">
                          <SelectItem value="None">None</SelectItem>
                          {detectedColumns.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#4a3a2a]/60 border-t border-[#c9ba96] pt-3">
                  Found {rawData.length} rows in your Excel file. Tasks will be
                  created based on the mapped columns.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            {step === 2 && (
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="border-[#c9ba96] hover:bg-[#c9ba96]/20"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {step === 1 && (
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="border-[#c9ba96] hover:bg-[#c9ba96]/20"
              >
                Cancel
              </Button>
            )}

            {step === 2 && (
              <>
                <Button
                  onClick={importTasks}
                  disabled={!validateMapping()}
                  className="bg-[#8a9a5b] text-white rounded-sm font-bold hover:bg-[#8a9a5b]/90"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Import {rawData.length} Tasks
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
