import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Textbox from "./Textbox";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Loading from "./Loader";

const AddUserForm = ({ open, setOpen, refetch, userData }) => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset form when opening/closing or when userData changes
  useEffect(() => {
    if (open) {
      reset({
        name: userData?.name || "",
        email: userData?.email || "",
        password: "",
        // Default values for new users
        ...(!userData && {
          title: "New Employee",
          role: "employee",
          isAdmin: false,
        }),
      });
    }
  }, [open, userData, reset]);

  const handleOnSubmit = async (data) => {
    try {
      const isEdit = !!userData;
      const url = isEdit
        ? `http://localhost:8800/api/users/${userData._id}`
        : "http://localhost:8800/api/user/register";

      const method = isEdit ? "PUT" : "POST";

      // Prepare the payload with automatic assignments
      const payload = isEdit
        ? data // For edits, send the form data as-is
        : {
            ...data,
            title: data.title || "New Employee",
            role: data.role || "employee",
            isAdmin: data.role === "Admin",
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      // Show success message
      toast.success(
        isEdit ? "User updated successfully!" : "New user added successfully!"
      );
      
      // Close the modal, reset the form, and refetch data
      setOpen(false);
      reset();
      refetch?.();
    } catch (err) {
      console.error("Operation error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title className="text-base font-bold mb-4">
          {userData ? "EDIT USER" : "ADD NEW USER"}
        </Dialog.Title>

        <div className="flex flex-col gap-6">
          <Textbox
            placeholder="Full Name"
            type="text"
            name="name"
            label="Full Name"
            register={register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <Textbox
            placeholder="Email"
            type="email"
            name="email"
            label="Email Address"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          {!userData && (
            <>
              <Textbox
                placeholder="Password"
                type="password"
                name="password"
                label="Password"
                register={register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                error={errors.password?.message}
              />

              <input type="hidden" {...register("title")} value="Member" />
              <input type="hidden" {...register("role")} value="User" />
              <input type="hidden" {...register("isAdmin")} value={false} />
            </>
          )}
        </div>

        {isSubmitting ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              label="Submit"
              className="bg-blue-600 text-white px-6"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              label="Cancel"
              className="bg-white text-gray-800 border mr-3"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUserForm;
