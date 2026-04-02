import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { toast } from "react-hot-toast";
import {
  getTrashedTasks,
  restoreTask,
  permanentDeleteTask,
  restoreAllTasks,
  permanentDeleteAllTasks,
} from "../utils/taskservice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const fetchTrashedTasks = async () => {
    try {
      const data = await getTrashedTasks();
      setTrashedTasks(data);
    } catch (err) {
      console.error("Failed to fetch trashed tasks", err);
      toast.error("Error loading trashed tasks.");
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    try {
      if (type === "restore") {
        await restoreTask(selected); // ✅ Now uses query param correctly
        toast.success("Task restored");
      } else if (type === "delete") {
        await permanentDeleteTask(selected);
        toast.success("Task permanently deleted");
      } else if (type === "restoreAll") {
        await restoreAllTasks(); // Make sure this function is called correctly
        toast.success("All tasks restored");
      } else if (type === "deleteAll") {
        await permanentDeleteAllTasks();
        toast.success("All tasks permanently deleted");
      }

      fetchTrashedTasks(); // Refresh after action
      setOpenDialog(false);
    } catch (error) {
      console.error("Action failed", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Operation failed");
      } else {
        toast.error("Operation failed: " + error.message);
      }
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2'>Modified On</th>
        <th className='py-2 text-end'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])} />
          <p className='w-full line-clamp-2 text-base text-black'>{item?.title}</p>
        </div>
      </td>
      <td className='py-2 capitalize'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>
      <td className='py-2 capitalize text-center md:text-start'>{item?.stage}</td>
      <td className='py-2 text-sm'>{new Date(item?.updatedAt).toDateString()}</td>
      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />
          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={restoreAllClick}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={deleteAllClick}
            />
          </div>
        </div>

        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {trashedTasks.length > 0 ? (
                  trashedTasks.map((tk) => <TableRow key={tk._id} item={tk} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      Trash is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
