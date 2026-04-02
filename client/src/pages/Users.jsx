import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { authApi } from "../utils/authApi";

const emptyForm = {
  name: "",
  email: "",
  title: "",
  role: "",
  isAdmin: false,
  isActive: true,
};

const Users = () => {
  const token = useSelector((state) => state.auth.user?.token);
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formState, setFormState] = useState(emptyForm);

  const loadUsers = async () => {
    try {
      const data = await authApi.getUsers(token);
      setUsers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load users.");
    }
  };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role, user.title].some((value) =>
        (value || "").toLowerCase().includes(search)
      )
    );
  }, [query, users]);

  const openEditor = (user) => {
    setSelectedUser(user);
    setFormState({
      name: user.name,
      email: user.email,
      title: user.title,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
      isActive: Boolean(user.isActive),
    });
  };

  const closeEditor = () => {
    setSelectedUser(null);
    setFormState(emptyForm);
  };

  const saveUser = async () => {
    try {
      await authApi.updateUser(selectedUser._id, formState, token);
      toast.success("User updated");
      closeEditor();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update user.");
    }
  };

  const toggleStatus = async (user) => {
    try {
      await authApi.toggleUserStatus(user._id, !user.isActive, token);
      toast.success(`User ${user.isActive ? "disabled" : "activated"}`);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update user status.");
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await authApi.deleteUser(user._id, token);
      toast.success("User removed");
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Admin controls</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Manage users and access levels</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Search accounts, adjust roles, toggle account status, and keep administrator access controlled.
            </p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, role, or title"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 lg:max-w-md"
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="pb-4">User</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Access</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Created</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t border-white/5">
                  <td className="py-4">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-white">{user.role}</p>
                    <p className="text-xs text-slate-500">{user.title}</p>
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      {user.isAdmin ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        user.isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-200"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor(user)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white hover:bg-white/5"
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={user._id === currentUserId}
                        className="rounded-xl border border-rose-400/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Edit user</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedUser.name}</h2>
              </div>
              <button type="button" onClick={closeEditor} className="text-sm text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["name", "Full name"],
                ["email", "Email"],
                ["title", "Title"],
                ["role", "Role"],
              ].map(([field, label]) => (
                <label key={field} className="text-sm text-slate-300">
                  <span className="mb-2 block">{label}</span>
                  <input
                    value={formState[field]}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, [field]: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={formState.isAdmin}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, isAdmin: event.target.checked }))
                  }
                />
                Administrator access
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, isActive: event.target.checked }))
                  }
                />
                Account active
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveUser}
                className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Users;
