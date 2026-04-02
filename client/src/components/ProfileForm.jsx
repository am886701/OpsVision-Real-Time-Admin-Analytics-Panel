import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast } from "sonner";

const ProfileForm = ({ open, setOpen, userData, refetch }) => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const isLoading = false; // Set to actual loading state if needed
  const isUpdating = false; // Set to actual updating state if needed

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        title: userData.title || "",
        email: userData.email || "",
        role: userData.role || "User",
      });
    }
  }, [userData, open, reset]); // Listen for userData change to reset form

  const handleOnSubmit = async (data) => {
    try {
      const baseURL = "http://localhost:8800/api";
      const url = `${baseURL}/user/${userData._id}`;
      
      // Only send the name field since that's the only editable field
      const payload = { name: data.name };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Operation failed");

      toast.success("Profile updated successfully!");
      
      // After updating, reset form and refetch the user data
      reset({
        name: data.name,
        title: userData.title,
        email: userData.email,
        role: userData.role
      });

      setOpen(false);

      // Trigger refetch to update the userData and refresh the profile form with updated data
      refetch(); // Call refetch passed from the parent to update user data

    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          UPDATE PROFILE
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          {/* Only name field is editable */}
          <Textbox
            placeholder="Full name"
            type="text"
            name="name"
            label="Full Name"
            className="w-full rounded"
            register={register("name", { required: "Full name is required!" })}
            error={errors.name?.message}
          />

          {/* Non-editable fields (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={userData?.title || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={userData?.email || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={userData?.role || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
          </div>
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

export default ProfileForm;
