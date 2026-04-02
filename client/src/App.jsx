import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";

function ProtectedLayout() {
  const { user, isSidebarOpen } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        {isSidebarOpen ? <div className="fixed inset-0 z-30 bg-slate-950/60 md:hidden" /> : null}
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          <main className="flex-1 px-4 pb-6 pt-4 md:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminOnly() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-slate-100">
        <h2 className="text-2xl font-semibold">Administrator access required</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          This dashboard is configured for admin users. Sign in with an admin account, or create the
          very first account locally to bootstrap the administrator role.
        </p>
      </div>
    );
  }

  return <Outlet />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route element={<AdminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/content" element={<Tasks />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
