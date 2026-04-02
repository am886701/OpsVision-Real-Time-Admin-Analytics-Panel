import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast } from "sonner";

const AddUser = ({ open, setOpen, userData, refetch }) => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const isLoading = false;
  const isUpdating = false;

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        title: userData.title || "",
        email: userData.email || "",
        role: userData.role || "User",
      });
    } else {
      reset({
        name: "",
        title: "",
        email: "",
        role: "User",
      });
    }
  }, [userData, open, reset]);

  const handleOnSubmit = async (data) => {
    try {
      const baseURL = "http://localhost:8800/api"; // ✅ Hardcoded API base URL

      const url = userData
        ? `${baseURL}/user/${userData._id}`
        : `${baseURL}/user`;

      const method = userData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Operation failed");

      toast.success(userData ? "User updated successfully!" : "User added successfully!");
      setOpen(false);
      reset();
      refetch?.(); // refresh user list
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Full name"
            type="text"
            name="name"
            label="Full Name"
            className="w-full rounded"
            register={register("name", { required: "Full name is required!" })}
            error={errors.name?.message}
          />
          <Textbox
            placeholder="Title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required!" })}
            error={errors.title?.message}
          />
          <Textbox
            placeholder="Email Address"
            type="email"
            name="email"
            label="Email Address"
            className="w-full rounded"
            register={register("email", { required: "Email Address is required!" })}
            error={errors.email?.message}
          />
          <Textbox
            placeholder="Role"
            type="text"
            name="role"
            label="Role"
            className="w-full rounded"
            register={register("role", { required: "User role is required!" })}
            error={errors.role?.message}
          />
        </div>

        {isLoading || isUpdating ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              label="Submit"
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
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;
