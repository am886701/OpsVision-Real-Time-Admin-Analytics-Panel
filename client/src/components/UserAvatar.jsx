import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { logout } from "../redux/reducers";
import ChangePasswordModal from "./ChangePasswordModal"; // Import the modal component
import ProfileForm from "./ProfileForm"; // Import ProfileForm

const UserAvatar = () => {
  const [open, setOpen] = useState(false); // State to control ProfileForm modal visibility
  const [openPassword, setOpenPassword] = useState(false); // Controls Change Password modal
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white font-semibold">
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                {/* Profile Button */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)} // This opens the ProfileForm modal
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                {/* Change Password Button */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUserLock className="mr-2" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                {/* Logout Button */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className="text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <IoLogOutOutline className="mr-2" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Render Profile Form Modal if open */}
      {open && <ProfileForm open={open} setOpen={setOpen} userData={user} />}
      
      {/* Render Change Password Modal if open */}
      {openPassword && <ChangePasswordModal onClose={() => setOpenPassword(false)} />}
    </>
  );
};

export default UserAvatar;
