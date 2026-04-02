import clsx from "clsx";
import { HiOutlineChartBarSquare, HiOutlineSquares2X2, HiOutlineUsers } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";

const links = [
  { label: "Overview", path: "/dashboard", icon: HiOutlineSquares2X2 },
  { label: "Users", path: "/users", icon: HiOutlineUsers },
  { label: "Content", path: "/content", icon: HiOutlineChartBarSquare },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isSidebarOpen, user } = useSelector((state) => state.auth);

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur-xl transition-transform md:static md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between md:block">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Insight Command</h1>
          <p className="mt-2 text-sm text-slate-400">
            Analytics, user governance, and content operations in one responsive workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(setOpenSidebar(false))}
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 md:hidden"
        >
          Close
        </button>
      </div>

      <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Signed in</p>
        <p className="mt-3 text-lg font-semibold text-white">{user?.name}</p>
        <p className="text-sm text-slate-300">{user?.title}</p>
      </div>

      <nav className="mt-8 space-y-3">
        {links.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => dispatch(setOpenSidebar(false))}
            className={clsx(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
              pathname === path
                ? "bg-white text-slate-950 shadow-lg shadow-cyan-500/10"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
