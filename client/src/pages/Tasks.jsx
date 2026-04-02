import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createTask, getTasks, trashTask, updateTask } from "../utils/taskservice";

const initialTaskForm = {
  title: "",
  priority: "medium",
  stage: "todo",
  date: "",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialTaskForm);
  const [filter, setFilter] = useState("all");

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load tasks.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createNewTask = async (event) => {
    event.preventDefault();

    try {
      await createTask({
        ...form,
        team: [],
        assets: [],
        date: form.date || new Date().toISOString(),
      });
      toast.success("Content item created");
      setForm(initialTaskForm);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create task.");
    }
  };

  const updateStage = async (task, stage) => {
    try {
      await updateTask(task._id, {
        ...task,
        team: task.team?.map((member) => member._id || member) || [],
        stage,
      });
      toast.success("Content updated");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update task.");
    }
  };

  const archiveTask = async (taskId) => {
    try {
      await trashTask(taskId);
      toast.success("Content archived");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to archive task.");
    }
  };

  const visibleTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.stage === filter);
  }, [filter, tasks]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={createNewTask} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Content management</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Publish and track operational tasks</h1>
          <p className="mt-3 text-sm text-slate-400">
            Admins can create content items, move them across stages, and archive outdated work from one screen.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Priority</span>
                <select
                  value={form.priority}
                  onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Stage</span>
                <select
                  value={form.stage}
                  onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Due date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            Create content item
          </button>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Workflow status</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Monitor content throughput</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["all", "All items", tasks.length],
              ["todo", "To Do", tasks.filter((task) => task.stage === "todo").length],
              ["in progress", "In Progress", tasks.filter((task) => task.stage === "in progress").length],
            ].map(([value, label, total]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-3xl border px-4 py-5 text-left ${
                  filter === value ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/5"
                }`}
              >
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{total}</p>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="pb-4">Title</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Stage</th>
                <th className="pb-4">Due date</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleTasks.map((task) => (
                <tr key={task._id} className="border-t border-white/5">
                  <td className="py-4 text-white">{task.title}</td>
                  <td className="py-4 capitalize">{task.priority}</td>
                  <td className="py-4">
                    <select
                      value={task.stage}
                      onChange={(event) => updateStage(task, event.target.value)}
                      className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4">{task.date ? new Date(task.date).toLocaleDateString() : "No date"}</td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => archiveTask(task._id)}
                      className="rounded-xl border border-amber-400/20 px-3 py-2 text-xs text-amber-200 hover:bg-amber-400/10"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Tasks;
