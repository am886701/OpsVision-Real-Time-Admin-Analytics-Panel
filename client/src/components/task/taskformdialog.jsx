import React from "react";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import SelectList from "../SelectList";
import Button from "../Button";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const TaskFormDialog = ({
  handleSubmit,
  submitHandler,
  register,
  errors,
  users,
  team,
  addToTeam,
  removeFromTeam,
  stage,
  setStage,
  priority,
  setPriority,
  reset,
  setOpen,
  task,
}) => {
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
        EDIT TASK
      </Dialog.Title>

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
            label="Update"
            type="submit"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          />
          <Button
            type="button"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => {
              setOpen(false);
              reset();
            }}
            label="Cancel"
          />
        </div>
      </div>
    </form>
  );
};

export default TaskFormDialog;
