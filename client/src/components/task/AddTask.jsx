import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { useForm } from "react-hook-form";
import Textbox from "../Textbox";
import SelectList from "../SelectList";
import Button from "../Button";
import { toast } from "react-hot-toast";
import { createTask, updateTask } from "../../utils/taskservice";
import { authApi } from "../../utils/authApi";
import TaskFormDialog from "../task/taskformdialog";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task, setTask }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authApi.getUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to load users.");
      }
    };

    if (open) {
      fetchUsers();

      if (task) {
        reset({
          title: task.title,
          date: task.date?.slice(0, 10),
        });
        setTeam(task.team || []);
        setStage(task.stage?.toUpperCase() || LISTS[0]);
        setPriority(task.priority?.toUpperCase() || PRIORIRY[2]);
      } else {
        reset({
          title: "",
          date: "",
        });
        setTeam([]);
        setStage(LISTS[0]);
        setPriority(PRIORIRY[2]);
      }
    }
  }, [open, task, token, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setTeam([]);
    setStage(LISTS[0]);
    setPriority(PRIORIRY[2]);
    if (setTask) setTask(null); // ✅ Clear the task in parent
  };

  const addToTeam = (e) => {
    const userId = e.target.value;
    if (userId && !team.includes(userId)) {
      setTeam([...team, userId]);
    }
  };

  const removeFromTeam = (id) => {
    setTeam(team.filter((uid) => uid !== id));
  };

  const submitHandler = async (data) => {
    try {
      const taskData = {
        title: data.title,
        team,
        stage: stage.toLowerCase(),
        date: data.date,
        priority: priority.toLowerCase(),
      };

      if (task) {
        await updateTask(task._id, taskData);
        toast.success("Task updated successfully");
      } else {
        await createTask(taskData);
        toast.success("Task added successfully");
      }

      handleClose(); // ✅ Close and reset everything
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(error.message || "Failed to save task. Please try again.");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={handleClose}>
      {task ? (
        <TaskFormDialog
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          register={register}
          errors={errors}
          users={users}
          team={team}
          addToTeam={addToTeam}
          removeFromTeam={removeFromTeam}
          stage={stage}
          setStage={setStage}
          priority={priority}
          setPriority={setPriority}
          reset={reset}
          setOpen={handleClose}
          task={task}
        />
      ) : (
        <form onSubmit={handleSubmit(submitHandler)}>
          <h2 className="text-base font-bold leading-6 text-gray-900 mb-4">ADD TASK</h2>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title?.message}
            />

            <div>
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                id="team"
                value=""
                onChange={addToTeam}
                className="w-full border rounded-md p-2"
                defaultValue=""
              >
                <option value="" disabled>Select users...</option>
                {users
                  .filter((u) => !team.includes(u._id))
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {team.map((id) => {
                  const user = users.find((u) => u._id === id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      {user?.name}
                      <button
                        type="button"
                        onClick={() => removeFromTeam(id)}
                        className="ml-2 text-blue-700 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList label="Task Stage" lists={LISTS} selected={stage} setSelected={setStage} />
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded"
                register={register("date", { required: "Date is required!" })}
                error={errors.date?.message}
              />
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Create"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={handleClose}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
};

export default AddTask;