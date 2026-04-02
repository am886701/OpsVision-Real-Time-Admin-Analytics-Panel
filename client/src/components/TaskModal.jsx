import React, { useState } from "react";

const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "normal",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave({ ...task, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border mb-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border mb-2 rounded"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-gray-600 px-3 py-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
