export interface Task {
  id: string;
  title: string;
  topicId: string;
  subtopicId?: string;
  status: "pending" | "completed" | "in-progress";
  note?: string;
}

export interface CheckIn {
  date: string;
  note?: string;
}

export interface Subtopic {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
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
  topics: Topic[];
  checkInHistory: CheckIn[];
  lastCheckInDate?: string;
}
