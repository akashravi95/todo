import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "progress" | "completed";
  dueDate: Date;
};

const statusLabels = {
  todo: "To Do",
  progress: "In Progress",
  completed: "Completed",
};

const statusColors = {
  todo: "bg-secondary text-secondary-foreground",
  progress: "bg-warning/20 text-warning",
  completed: "bg-success/20 text-success",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-muted">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-foreground">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
      <div className="flex items-center text-xs text-muted-foreground">
        <CalendarIcon className="w-3 h-3 mr-1.5" />
        <span>{format(task.dueDate, "MMM d, yyyy")}</span>
      </div>
    </Card>
  );
}