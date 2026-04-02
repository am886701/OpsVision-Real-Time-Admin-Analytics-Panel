import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Textbox from "../components/Textbox";
import { setUser } from "../redux/slices/authSlice";
import { authApi } from "../utils/authApi";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitHandler = async (formData) => {
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login(formData);

        if (!response?.status) {
          toast.error(response?.message || "Unable to sign in.");
          return;
        }

        dispatch(setUser(response));
        localStorage.setItem("role", response.role);
        toast.success("Welcome to the admin dashboard");
        navigate("/dashboard");
        return;
      }

      const response = await authApi.register({
        ...formData,
        role: "Analyst",
        title: "Operations Analyst",
      });

      if (!response?.status) {
        toast.error(response?.message || "Unable to create account.");
        return;
      }

      toast.success(response.message || "Account created. Please sign in.");
      reset();
      setIsLogin(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#020617,_#111827_55%,_#0f172a)] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-8">
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200">
            Analytics and Reporting
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              Responsive admin reporting for users, operations, and live task metrics.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              This upgraded project turns the original task system into an admin-facing command
              center with role-based access, auto-refreshing charts, and user/content controls.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Active user tracking", "Monitor team health and new sign-ups from one view."],
              ["Real-time charts", "Keep dashboards fresh with automatic analytics refreshes."],
              ["Admin controls", "Manage users, roles, statuses, and task content securely."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl md:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">
              {isLogin ? "Secure sign in" : "Bootstrap access"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {isLogin ? "Administrator login" : "Create your local account"}
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              The first registered account becomes the admin automatically for local setup.
            </p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {!isLogin ? (
              <Textbox
                label="Full Name"
                name="name"
                type="text"
                placeholder="Alex Morgan"
                register={register("name", { required: "Full name is required" })}
                error={errors.name?.message}
                className="rounded-2xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500"
                icon={<FiUser className="text-slate-500" />}
              />
            ) : null}

            <Textbox
              label="Email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              register={register("email", { required: "Email is required" })}
              error={errors.email?.message}
              className="rounded-2xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500"
              icon={<FiMail className="text-slate-500" />}
            />

            <Textbox
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              register={register("password", { required: "Password is required" })}
              error={errors.password?.message}
              className="rounded-2xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500"
              icon={<FiLock className="text-slate-500" />}
            />

            <Button
              type="submit"
              label={loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              className="w-full rounded-2xl bg-cyan-300 py-3 font-semibold text-slate-950 hover:bg-cyan-200"
            />
          </form>

          <button
            type="button"
            onClick={() => setIsLogin((current) => !current)}
            className="mt-6 text-sm text-cyan-200 transition hover:text-cyan-100"
          >
            {isLogin ? "Need a local account? Create one" : "Already have access? Sign in"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Login;
