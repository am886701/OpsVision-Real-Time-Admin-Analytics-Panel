import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  getNotifications,
  markNotificationAsRead,
} from "../redux/notificationService";
import { Dialog } from "@headlessui/react";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

// ...imports remain unchanged

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // ✅ Now uses isReadByUser directly
  const isNotificationRead = (noti) => noti.isReadByUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.token) {
          const data = await getNotifications(user.token);
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const readHandler = async (id) => {
    try {
      await markNotificationAsRead(id, user.token);
      setNotifications((prev) =>
        prev.map((noti) =>
          noti._id === id
            ? { ...noti, isReadByUser: true }
            : noti
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isReadByUser);
      for (const noti of unread) {
        await markNotificationAsRead(noti._id, user.token);
      }
      setNotifications((prev) =>
        prev.map((n) =>
          !n.isReadByUser
            ? { ...n, isReadByUser: true }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const viewHandler = (item) => {
    if (!item.isReadByUser) {
      readHandler(item._id);
    }
  };

  const callsToAction = [
    { name: "Cancel", onClick: null },
    { name: "Mark All Read", onClick: markAllRead },
  ];

  const unreadCount = notifications.filter((n) => !n.isReadByUser).length;

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {unreadCount}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) => (
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                {notifications?.length > 0 ? (
                  <>
                    <div className="p-4">
                      {notifications.slice(0, 5).map((item) => (
                        <div
                          key={item._id}
                          className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                            {ICONS[item.notiType]}
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() => viewHandler(item)}
                          >
                            <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                              <p>{item.notiType}</p>
                              <span className="text-xs font-normal lowercase">
                                {moment(item.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className="line-clamp-1 mt-1 text-gray-600">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 divide-x bg-gray-50">
                      {callsToAction.map((item) => (
                        <button
                          key={item.name}
                          onClick={
                            item.onClick ? () => item.onClick() : () => close()
                          }
                          className="flex items-center justify-center gap-x-2.5 p-3 w-full font-semibold text-blue-600 hover:bg-gray-100"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 border-t text-center bg-white">
                      <button
                        onClick={() => {
                          close();
                          setModalOpen(true);
                        }}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </>
                ) : (
                  !loading && (
                    <div className="p-6 text-center text-gray-600">
                      <p>No notifications yet.</p>
                    </div>
                  )
                )}
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>

      {/* Modal for All Notifications */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold text-gray-900 mb-4">
                    All Notifications
                  </Dialog.Title>
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                    {notifications.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-semibold text-gray-800">
                            {item.notiType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {moment(item.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default NotificationPanel;
