import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

// Main Confirmation Dialog
export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
  
    setOpen(false);
  };

  // Determine the action label based on type
  const getActionLabel = () => {
    switch (type) {
      case "restore":
        return "Restore";
      case "restoreAll":
        return "Restore All";
      case "deleteAll":
        return "Delete All";
      default:
        return "Delete";
    }
  };

  return (
    <ModalWrapper open={open} setOpen={closeDialog}>
      <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
        <Dialog.Title as='h3'>
          <p
            className={clsx(
              "p-3 rounded-full",
              type === "restore" || type === "restoreAll"
                ? "text-yellow-600 bg-yellow-100"
                : "text-red-600 bg-red-200"
            )}
          >
            <FaQuestion size={60} />
          </p>
        </Dialog.Title>

        <p className='text-center text-gray-500'>
          {msg ?? "Are you sure you want to delete the selected record?"}
        </p>

        <div className='bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4'>
          <Button
            type='button'
            className={clsx(
              "px-8 text-sm font-semibold text-white sm:w-auto",
              type === "restore" || type === "restoreAll"
                ? "bg-yellow-600"
                : "bg-red-600 hover:bg-red-500"
            )}
            onClick={() => {
              onClick(); // call the delete or restore handler
              closeDialog(); // close the dialog after action
            }}
            label={getActionLabel()}
          />

          <Button
            type='button'
            className='bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border'
            onClick={closeDialog}
            label='Cancel'
          />
        </div>
      </div>
    </ModalWrapper>
  );
}

// User-specific Action Dialog (e.g., activate/deactivate)
export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={closeDialog}>
      <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
        <Dialog.Title as='h3'>
          <p className='p-3 rounded-full text-red-600 bg-red-200'>
            <FaQuestion size={60} />
          </p>
        </Dialog.Title>

        <p className='text-center text-gray-500'>
          Are you sure you want to activate or deactivate this account?
        </p>

        <div className='bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4'>
          <Button
            type='button'
            className='px-8 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 sm:w-auto'
            onClick={() => {
              onClick();
              closeDialog();
            }}
            label='Yes'
          />

          <Button
            type='button'
            className='bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border'
            onClick={closeDialog}
            label='No'
          />
        </div>
      </div>
    </ModalWrapper>
  );
}