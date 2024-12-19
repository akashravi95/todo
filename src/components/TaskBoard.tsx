import { useState } from "react";
import { TaskCard, Task } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Design New Landing Page",
    description: "Create wireframes and mockups for the new marketing site",
    status: "todo",
    dueDate: new Date("2024-04-15"),
  },
  {
    id: "2",
    title: "Implement Authentication",
    description: "Add user login and registration functionality",
    status: "progress",
    dueDate: new Date("2024-04-10"),
  },
  {
    id: "3",
    title: "Write Documentation",
    description: "Document the API endpoints and usage guidelines",
    status: "completed",
    dueDate: new Date("2024-04-05"),
  },
];

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([...tasks, task]);
    toast({
      title: "Success",
      description: "Task created successfully!",
    });
  };

  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit);
  };

  const handleUpdateTask = (updatedTask: Omit<Task, "id">) => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask?.id ? { ...updatedTask, id: task.id } : task
      )
    );
    setEditingTask(undefined);
    toast({
      title: "Success",
      description: "Task updated successfully!",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully!",
      variant: "destructive",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.filter((task) => task.id === draggableId);

    if (movedTask) {
      const newStatus = destination.droppableId as Task["status"];
      movedTask.status = newStatus;
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
          <Button onClick={() => setIsFormOpen(true)} className="task-board-button">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10 task-board-search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-board-column"
              >
                <h3 className="task-board-column-header">To Do</h3>
                <div className="space-y-4">
                  {filterTasksByStatus("todo").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="group relative animate-fade-in">
                            <TaskCard task={task} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTask(task)}
                                className="hover:bg-background/50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* In Progress Column */}
          <Droppable droppableId="progress">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-board-column"
              >
                <h3 className="task-board-column-header">In Progress</h3>
                <div className="space-y-4">
                  {filterTasksByStatus("progress").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="group relative animate-fade-in">
                            <TaskCard task={task} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTask(task)}
                                className="hover:bg-background/50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Completed Column */}
          <Droppable droppableId="completed">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-board-column"
              >
                <h3 className="task-board-column-header">Completed</h3>
                <div className="space-y-4">
                  {filterTasksByStatus("completed").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="group relative animate-fade-in">
                            <TaskCard task={task} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTask(task)}
                                className="hover:bg-background/50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddTask}
      />

      {editingTask && (
        <TaskForm
          open={!!editingTask}
          onOpenChange={() => setEditingTask(undefined)}
          onSubmit={handleUpdateTask}
          initialTask={editingTask}
        />
      )}
    </div>
  );
}