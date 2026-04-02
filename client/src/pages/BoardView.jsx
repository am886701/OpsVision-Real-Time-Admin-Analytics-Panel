import React from "react";

const statusColors = {
  todo: "bg-yellow-100",
  "in progress": "bg-blue-100",
  completed: "bg-green-100",
};

const statusTitles = {
  todo: "To Do",
  "in progress": "In Progress",
  completed: "Completed",
};

const BoardView = ({ tasks = [] }) => {
  // Group tasks by status
  const groupedTasks = {
    todo: [],
    "in progress": [],
    completed: [],
  };

  tasks.forEach((task) => {
    const status = task.status?.toLowerCase();
    if (groupedTasks[status]) {
      groupedTasks[status].push(task);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.keys(groupedTasks).map((status) => (
        <div key={status} className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {statusTitles[status]}
          </h2>

          <div className="space-y-4">
            {groupedTasks[status].length === 0 ? (
              <p className="text-gray-400 text-sm italic">No tasks</p>
            ) : (
              groupedTasks[status].map((task) => (
                <div
                  key={task._id}
                  className={`rounded-lg p-4 shadow ${statusColors[status]}`}
                >
                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Priority: {task.priority || "Normal"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardView;
