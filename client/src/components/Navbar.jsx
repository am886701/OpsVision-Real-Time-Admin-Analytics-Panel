import { HiBars3, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout, setOpenSidebar } from "../redux/slices/authSlice";
import { authApi } from "../utils/authApi";

const pageTitles = {
  "/dashboard": "Executive overview",
  "/users": "User administration",
  "/content": "Content operations",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await authApi.logout();
    dispatch(logout());
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur md:px-6 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(setOpenSidebar(true))}
            className="rounded-2xl border border-white/10 p-2 text-slate-200 md:hidden"
          >
            <HiBars3 className="text-xl" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Dashboard</p>
            <h2 className="text-2xl font-semibold text-white">
              {pageTitles[location.pathname] || "Analytics workspace"}
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Role</span>
            <span className="text-white">{user?.role || "Admin"}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            <HiOutlineArrowRightOnRectangle className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
