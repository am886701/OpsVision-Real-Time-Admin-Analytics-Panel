import React, { useEffect, useState } from "react";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask"; // ✅ Import AddTask modal
import { getTasks } from "../utils/taskservice";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [open, setOpen] = useState(false); // ✅ Modal state

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks();
      const todoTasks = response.tasks.filter((task) => task.stage === "todo");
      setTasks(todoTasks);
    } catch (err) {
      console.error("Failed to load todo tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpen(true); // ✅ Open modal on edit
  };

  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full p-4'>
      <div className='flex items-center justify-between mb-4'>
        <Title title='To Do Tasks' />
      </div>

      <Table tasks={tasks} onEdit={handleEditTask} refetch={fetchTasks} />

      {/* ✅ AddTask modal for editing */}
      <AddTask
        open={open}
        setOpen={setOpen}
        task={editingTask}
        setTask={setEditingTask}
        key={editingTask ? editingTask._id : "edit-task"}
        refetch={fetchTasks}
      />
    </div>
  );
};

export default Todo;
