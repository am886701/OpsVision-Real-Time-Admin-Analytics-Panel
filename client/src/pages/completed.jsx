import React, { useEffect, useState } from "react";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { getTasks } from "../utils/taskservice";

const Completed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [open, setOpen] = useState(false); // 🟢 Add modal state

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks();
      const completed = response.tasks.filter((task) => task.stage === "completed");
      setTasks(completed);
    } catch (err) {
      console.error("Failed to load completed tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpen(true); // 🟢 Show the modal when edit is clicked
  };

  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full p-4'>
      <div className='flex items-center justify-between mb-4'>
        <Title title='Completed Tasks' />
      </div>

      <Table tasks={tasks} onEdit={handleEditTask} refetch={fetchTasks} />

      {/* 🟢 Edit Task modal */}
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

export default Completed;
