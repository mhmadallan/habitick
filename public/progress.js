import {
  requireUser,
  fetchTasks,
  fetchCompletionDates,
  fetchCompletionsInRange,
  fetchTaskCompletionsSince
} from "./api.js";

const mustLoginBox = document.getElementById("mustLoginBox");
const progressList = document.getElementById("progressList");
const emptyProgress = document.getElementById("emptyProgress");

const pointsTodayEl = document.getElementById("pointsToday");
const pointsWeekEl = document.getElementById("pointsWeek");
const pointsMonthEl = document.getElementById("pointsMonth");

const weeklyPercentEl = document.getElementById("weeklyPercent");
const weeklyPercentMetaEl = document.getElementById("weeklyPercentMeta");

const topHabitNameEl = document.getElementById("topHabitName");
const topHabitMetaEl = document.getElementById("topHabitMeta");

// ---------- date helpers ----------
function toMidnight(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function startOfWeek(date) {
  const d = toMidnight(date); // Monday-start week
  const day = d.getDay(); // 0 Sun, 1 Mon...
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(d, diff);
}
function startOfMonth(date) {
  const d = toMidnight(date);
  d.setDate(1);
  return d;
}
function periodRange(unit, now = new Date()) {
  const start =
    unit === "daily"
      ? toMidnight(now)
      : unit === "weekly"
      ? startOfWeek(now)
      : startOfMonth(now);

  let end;
  if (unit === "daily") end = addDays(start, 1);
  if (unit === "weekly") end = addDays(start, 7);
  if (unit === "monthly") {
    end = new Date(start);
    end.setMonth(end.getMonth() + 1);
  }
  return { start, end };
}
function prevPeriodStart(unit, start) {
  if (unit === "daily") return addDays(start, -1);
  if (unit === "weekly") return addDays(start, -7);
  // monthly:
  const d = new Date(start);
  d.setMonth(d.getMonth() - 1);
  return d;
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}
function sumPoints(rows) {
  return (rows || []).reduce((sum, r) => sum + (Number(r.points_at_completion) || 0), 0);
}
function badgeClass(done, target) {
  if (done >= target) return "bg-green-100 text-green-800";
  if (done === 0) return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

// ---------- streak calc (frequency model) ----------
/**
 * Streak = number of consecutive periods (daily/weekly/monthly depending on task)
 * where completions in that period >= target.
 */
function countCompletionsInRange(rows, startISO, endISO) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  let c = 0;
  for (const r of rows) {
    const t = new Date(r.done_at).getTime();
    if (t >= start && t < end) c++;
  }
  return c;
}

async function computeStreak(task, now = new Date()) {
  const unit = task.frequency_unit || "daily";
  const target = Number(task.times_per_frequency || 1);

  // We’ll look back a reasonable amount:
  // daily: last 120 days, weekly: last 104 weeks, monthly: last 60 months
  const lookbackStart = (() => {
    const d = new Date(now);
    if (unit === "daily") d.setDate(d.getDate() - 120);
    else if (unit === "weekly") d.setDate(d.getDate() - (7 * 104));
    else d.setMonth(d.getMonth() - 60);
    return d;
  })();

  const all = await fetchTaskCompletionsSince(task.id, lookbackStart.toISOString());

  // start with current period and move backward until we miss target
  let streak = 0;
  let { start, end } = periodRange(unit, now);

  while (true) {
    const done = countCompletionsInRange(all, start.toISOString(), end.toISOString());
    if (done >= target) {
      streak++;
      const prevStart = prevPeriodStart(unit, start);
      end = start;
      start = prevStart;
    } else {
      break;
    }
  }

  return streak;
}

// ---------- render ----------
function renderProgress(items) {
  progressList.innerHTML = "";

  if (!items.length) {
    emptyProgress.classList.remove("hidden");
    return;
  }
  emptyProgress.classList.add("hidden");

  items.forEach(item => {
    const target = Number(item.times_per_frequency || 1);
    const done = Number(item.doneCount || 0);

    const card = document.createElement("div");
    card.className = "border rounded-xl p-3 bg-slate-50";
    card.style.cursor = "pointer";
    card.onclick = () => (window.location.href = `/task.html?id=${item.id}`);

    const top = document.createElement("div");
    top.className = "flex items-start justify-between gap-3";

    const left = document.createElement("div");

    const title = document.createElement("div");
    title.className = "font-semibold";
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    const cat = item.category ? ` · ${item.category}` : "";
    meta.textContent = `${item.frequency_unit}${cat} · target ${target} · points ${item.points} · 🔥 streak ${item.streak}`;

    left.appendChild(title);
    left.appendChild(meta);

    const badge = document.createElement("div");
    badge.className = `text-xs px-2 py-1 rounded-lg ${badgeClass(done, target)}`;
    badge.textContent = done >= target ? "Target reached" : "In progress";

    top.appendChild(left);
    top.appendChild(badge);

    const count = document.createElement("div");
    count.className = "text-sm mt-2";
    count.textContent = `Done this period: ${done}/${target}`;

   /* const dates = document.createElement("div");
    dates.className = "text-xs text-slate-600 mt-1";
    dates.textContent = item.doneDates.length
      ? "Dates: " + item.doneDates.map(formatDate).join(", ")
      : "Dates: (none yet)";
*/
const ends = document.createElement("div");
ends.className = "text-xs text-slate-600 mt-1";

const endDate = new Date(item.periodEndISO);
const now = new Date();
const msLeft = endDate - now;
const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

ends.textContent = `Period ends: ${endDate.toLocaleString()} · ${daysLeft} day(s) left`;

card.appendChild(ends);

    card.appendChild(top);
    card.appendChild(count);
    // card.appendChild(dates);

    progressList.appendChild(card);
  });
}

// ---------- weekly completion % + top habit ----------
function computeWeeklyTargetForTask(task) {
  const t = Number(task.times_per_frequency || 1);
  if (task.frequency_unit === "weekly") return t;
  if (task.frequency_unit === "daily") return t * 7;
  // monthly tasks are excluded from weekly % (to avoid confusing math)
  return 0;
}

async function loadProgress() {
  try {
    mustLoginBox.classList.add("hidden");
    await requireUser();

    const now = new Date();
    const day = periodRange("daily", now);
    const week = periodRange("weekly", now);
    const month = periodRange("monthly", now);

    // Points summary
    const [dayRows, weekRows, monthRows] = await Promise.all([
      fetchCompletionsInRange(day.start.toISOString(), day.end.toISOString()),
      fetchCompletionsInRange(week.start.toISOString(), week.end.toISOString()),
      fetchCompletionsInRange(month.start.toISOString(), month.end.toISOString())
    ]);

    pointsTodayEl.textContent = String(sumPoints(dayRows));
    pointsWeekEl.textContent = String(sumPoints(weekRows));
    pointsMonthEl.textContent = String(sumPoints(monthRows));

    // Tasks
    const tasks = await fetchTasks();
    if (!tasks.length) {
      renderProgress([]);
      weeklyPercentEl.textContent = "—";
      weeklyPercentMetaEl.textContent = "—";
      topHabitNameEl.textContent = "—";
      topHabitMetaEl.textContent = "—";
      return;
    }

    // Per-task progress + streaks
    const items = [];
    for (const task of tasks) {
      const unit = task.frequency_unit || "daily";
      const { start, end } = periodRange(unit, now);

      const rows = await fetchCompletionDates(task.id, start.toISOString(), end.toISOString());
      const streak = await computeStreak(task, now);

     /* const { start, end } = periodRange(unit, now);
const rows = await fetchCompletionDates(task.id, start.toISOString(), end.toISOString());*/

items.push({
  ...task,
  doneCount: rows.length,
  // keep dates only if you still need them elsewhere
  doneDates: rows.map(r => r.done_at),
  streak,
  periodEndISO: end.toISOString()
});

    }

    renderProgress(items);

    // Weekly completion % (Daily + Weekly only)
    const weekStartISO = week.start.toISOString();
    const weekEndISO = week.end.toISOString();

    let totalDone = 0;
    let totalTarget = 0;

    // We need done counts in the current week for each task
    for (const task of tasks) {
      if (!task.is_active) continue;

      const weeklyTarget = computeWeeklyTargetForTask(task);
      if (weeklyTarget <= 0) continue;

      const rows = await fetchCompletionDates(task.id, weekStartISO, weekEndISO);
      totalDone += rows.length;
      totalTarget += weeklyTarget;
    }

    const percent = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;
    weeklyPercentEl.textContent = totalTarget > 0 ? `${percent}%` : "—";
    weeklyPercentMetaEl.textContent =
      totalTarget > 0
        ? `${totalDone} / ${totalTarget} actions (Daily+Weekly tasks)`
        : "No Daily/Weekly tasks to score";

    // Top habit this week (by points earned, tie-break by completions)
    const pointsByTask = new Map(); // taskId -> {points, count}
    for (const r of weekRows) {
      const taskId = r.task_id;
      const prev = pointsByTask.get(taskId) || { points: 0, count: 0 };
      prev.points += Number(r.points_at_completion) || 0;
      prev.count += 1;
      pointsByTask.set(taskId, prev);
    }

    let top = null; // {task, points, count}
    for (const task of tasks) {
      const s = pointsByTask.get(task.id);
      if (!s) continue;
      if (!top) top = { task, ...s };
      else {
        if (s.points > top.points) top = { task, ...s };
        else if (s.points === top.points && s.count > top.count) top = { task, ...s };
      }
    }

    if (top) {
      topHabitNameEl.textContent = top.task.name;
      topHabitMetaEl.textContent = `${top.points} points · ${top.count} completions this week`;
    } else {
      topHabitNameEl.textContent = "—";
      topHabitMetaEl.textContent = "No completions this week yet";
    }
  } catch (err) {
    console.error(err);
    mustLoginBox.classList.remove("hidden");
    progressList.innerHTML = "";
    emptyProgress.classList.add("hidden");

    pointsTodayEl.textContent = "—";
    pointsWeekEl.textContent = "—";
    pointsMonthEl.textContent = "—";

    weeklyPercentEl.textContent = "—";
    weeklyPercentMetaEl.textContent = "—";
    topHabitNameEl.textContent = "—";
    topHabitMetaEl.textContent = "—";
  }
}

loadProgress();
