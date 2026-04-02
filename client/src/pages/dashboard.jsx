import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiMiniArrowTrendingUp, HiMiniBellAlert, HiMiniCheckBadge, HiMiniUsers } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { authApi } from "../utils/authApi";

const Card = ({ label, value, helper, icon: Icon }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-2 text-sm text-slate-400">{helper}</p>
      </div>
      <div className="rounded-2xl bg-cyan-300/15 p-3 text-cyan-200">
        <Icon className="text-2xl" />
      </div>
    </div>
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const Dashboard = () => {
  const token = useSelector((state) => state.auth.user?.token);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchAnalytics = async () => {
      if (!token) return;

      try {
        const data = await authApi.getAnalytics(token);
        if (mounted) {
          setAnalytics(data);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || "Unable to load analytics.");
        }
      }
    };

    fetchAnalytics();
    const intervalId = window.setInterval(fetchAnalytics, 20000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [token]);

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">{error}</div>
    );
  }

  if (!analytics) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading dashboard analytics...</div>;
  }

  const { summary, charts, tables } = analytics;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.45))] p-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">Live overview</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-white">
              Admin reporting with real-time visibility into users, workload, and platform activity.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-200">
              Charts refresh automatically every 20 seconds so the dashboard stays current during reviews,
              standups, and operations monitoring.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card
              label="Completion rate"
              value={`${summary.completionRate}%`}
              helper={`${summary.completedTasks} tasks completed`}
              icon={HiMiniCheckBadge}
            />
            <Card
              label="Weekly alerts"
              value={summary.weeklyAlerts}
              helper="Unread notifications and workflow signals"
              icon={HiMiniBellAlert}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card label="Active users" value={summary.activeUsers} helper={`${summary.totalUsers} total accounts`} icon={HiMiniUsers} />
        <Card label="New sign-ups" value={summary.recentUsers} helper="Last 30 days" icon={HiMiniArrowTrendingUp} />
        <Card label="Open tasks" value={summary.totalTasks - summary.completedTasks} helper="Items needing attention" icon={HiMiniBellAlert} />
        <Card label="Overdue tasks" value={summary.overdueTasks} helper="Past due and not completed" icon={HiMiniCheckBadge} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Activity trend" subtitle="Daily sign-ups and task creation volume">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.activityTrend}>
                <defs>
                  <linearGradient id="signupFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="signups" stroke="#22d3ee" fill="url(#signupFill)" />
                <Area type="monotone" dataKey="tasks" stroke="#f59e0b" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Task stage split" subtitle="Current workload by status">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.stageDistribution}
                  dataKey="total"
                  nameKey="name"
                  outerRadius={110}
                  fill="#22d3ee"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Section title="Priority distribution" subtitle="High-risk work surfaced first">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.priorityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="total" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Signup momentum" subtitle="Six-month user acquisition trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.signupTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="total" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Section title="Recent content activity" subtitle="Latest task updates across the system">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {tables.recentTasks.map((task) => (
                  <tr key={task._id} className="border-t border-white/5">
                    <td className="py-3 text-white">{task.title}</td>
                    <td className="py-3 capitalize">{task.stage}</td>
                    <td className="py-3 capitalize">{task.priority}</td>
                    <td className="py-3">{new Date(task.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Team snapshot" subtitle="Active users and roles">
          <div className="space-y-3">
            {tables.teamSnapshot.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">
                    {member.title} · {member.role}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  {member.isActive ? "Active" : "Paused"}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
