import { useTasks } from "@/context/taskContext";
import { edit, star, trash } from "@/utils/icons";
import { Task } from "@/utils/types";
import { formatTime } from "@/utils/utilities";
import React from "react";
import { motion } from "framer-motion";
import { item } from "@/utils/animations";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const { getTask, openModalForEdit, deleteTask, modalMode } = useTasks();

  return (
    <motion.div
      className="h-[14rem] px-4 py-3 flex flex-col gap-3 shadow-lg bg-[#f9f9f9] rounded-lg border-2 border-gold hover:scale-95 transition-all duration-300 ease-in-out transform hover:border-[#FFD700]"
      variants={item}
    >
      <div>
        <h4 className="font-semibold text-xl text-black">{task.title}</h4>
        <p className="text-sm text-black">{task.description}</p>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <p className="text-xs text-gray-400">{formatTime(task.createdAt)}</p>
        <p className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </p>
        <div>
          <div className="flex items-center gap-3 text-gray-400 text-[1rem]">
            <button
              className={`${
                task.completed ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {star}
            </button>
            <button
              className="text-[#00A1F1]"
              onClick={() => {
                getTask(task._id);
                openModalForEdit(task);
              }}
            >
              {edit}
            </button>
            <button
              className="text-[#F65314]"
              onClick={() => {
                deleteTask(task._id);
              }}
            >
              {trash}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskItem;
