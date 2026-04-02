import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import ConfirmatioDialog from "../Dialogs";
import { toast } from "sonner";

const TaskDialog = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const duplicateHandler = () => {
    toast.success("Duplicated Task");
  };

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const deleteHandler = () => {
    toast.success("Task deleted");
    setOpenDialog(false);
  };

  const items = [
    {
      label: "Edit Task",
      icon: <MdOutlineEdit />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Duplicate Task",
      icon: <HiDuplicate />,
      onClick: duplicateHandler,
    },
    {
      label: "Delete Task",
      icon: <RiDeleteBin6Line />,
      onClick: deleteClicks,
    },
  ];

  return (
    <div className='relative'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='text-gray-500 hover:text-black focus:outline-none'>
            <BsThreeDots size={20} />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none'>
            {items.map((item, index) => (
              <div className='px-1 py-1' key={index}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      className={`${
                        active ? "bg-gray-100" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {item.icon}
                      <span className='ml-2'>{item.label}</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <AddSubTask open={open} setOpen={setOpen} />
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </div>
  );
};

export default TaskDialog;
