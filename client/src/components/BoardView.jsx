import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "./TaskModal";
import axios from "axios";
import clsx from "clsx";

const statusColors = {
  todo: "border-blue-400 text-blue-600",
  "in progress": "border-yellow-400 text-yellow-600",
  completed: "border-green-400 text-green-600",
  default: "border-gray-300 text-gray-700",
};

const cardBgColors = {
  low: "bg-gradient-to-r from-green-100 via-green-50 to-white",
  normal: "bg-gradient-to-r from-yellow-100 via-yellow-50 to-white",
  high: "bg-gradient-to-r from-red-100 via-red-50 to-white",
};

const priorityColors = {
  low: "bg-green-200 text-green-800",
  normal: "bg-yellow-200 text-yellow-800",
  high: "bg-red-200 text-red-800",
};

const BGS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

const getPriorityClass = (priority = "normal") =>
  priorityColors[priority.toLowerCase()] || priorityColors.normal;

const getCardBg = (priority = "normal") =>
  cardBgColors[priority.toLowerCase()] || cardBgColors.normal;

const getStatusColor = (status) => {
  const lower = status?.toLowerCase();
  return statusColors[lower] || statusColors.default;
};

const BoardView = ({ tasks = [], onStatusChange, onEdit }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const STAGE_ORDER = ["todo", "in progress", "completed"];

  const groupedTasks = STAGE_ORDER.map((stage) => ({
    stage,
    items: tasks.filter((task) => task.stage?.toLowerCase() === stage),
  }));

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    try {
      const taskToUpdate = tasks.find(task => task._id === draggableId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        stage: destination.droppableId,
      };

      const response = await axios.put(`/api/tasks/${draggableId}`, {
        title: updatedTask.title,
        date: updatedTask.date,
        team: updatedTask.team,
        stage: updatedTask.stage,
        priority: updatedTask.priority,
        assets: updatedTask.assets,
      });

      if (response.data.status && onStatusChange) {
        onStatusChange(draggableId, destination.droppableId);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 px-2">
          {groupedTasks.map(({ stage, items }) => {
            const statusStyle = getStatusColor(stage);
            let columnBgColor = "bg-blue-50";
            if (stage === "in progress") columnBgColor = "bg-yellow-50";
            else if (stage === "completed") columnBgColor = "bg-green-50";

            return (
              <Droppable droppableId={stage} key={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-w-[320px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border-t-4 transition-all duration-300 ${statusStyle.split(" ")[0]}`}
                  >
                    <h2 className={`text-xl font-semibold p-4 pb-2 capitalize ${statusStyle.split(" ")[1]}`}>
                      {stage}
                    </h2>

                    <div className={`${columnBgColor} px-4 pb-4 rounded-b-xl min-h-[200px] flex flex-col gap-4`}>
                      {items.map((task, index) => {
                        const priority = task.priority?.toLowerCase() || "normal";
                        return (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                onClick={() => setSelectedTask(task)}
                                className={`p-4 rounded-lg shadow hover:shadow-lg border border-gray-200 cursor-pointer transition-all duration-200 ${getCardBg(priority)}`}
                              >
                                {/* Task Name */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  {task.title}
                                </h3>

                                {/* Team Members Initials */}
                                {task.team && task.team.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {task.team.map((m, idx) => (
                                      <div
                                        key={m._id}
                                        className={clsx(
                                          "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-medium",
                                          BGS[idx % BGS.length]
                                        )}
                                      >
                                        {m.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Priority & Date */}
                                <div className="flex justify-between items-center text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full font-medium ${getPriorityClass(priority)}`}
                                  >
                                    {task.priority || "Normal"}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      {items.length === 0 && (
                        <p className="text-sm italic text-gray-500">No tasks</p>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {selectedTask && (
        <Modal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={onEdit}
        />
      )}
    </>
  );
};

export default BoardView;
