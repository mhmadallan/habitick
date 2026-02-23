import { requireUser, fetchTasks, fetchCompletionDates } from "./api.js";

const mustLoginBox = document.getElementById("mustLoginBox");
const nameEl = document.getElementById("name");
const metaEl = document.getElementById("meta");
const notesEl = document.getElementById("notes");

const periodRangeEl = document.getElementById("periodRange");
const periodCountEl = document.getElementById("periodCount");
const completionDatesEl = document.getElementById("completionDates");
const noCompletionsEl = document.getElementById("noCompletions");

// ---------- helpers ----------
function getId() {
  const url = new URL(window.location.href);
  return Number(url.searchParams.get("id"));
}

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
  // Monday-start week
  const d = toMidnight(date);
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

function fmt(d) {
  return new Date(d).toLocaleString();
}

function fmtDateOnly(iso) {
  return new Date(iso).toLocaleDateString();
}

// ---------- load ----------
async function load() {
  try {
    mustLoginBox.classList.add("hidden");
    await requireUser();

    const id = getId();
    if (!id) {
      nameEl.textContent = "Task not found";
      return;
    }

    // Simple approach: fetch all tasks and find one
    const tasks = await fetchTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      nameEl.textContent = "Task not found";
      metaEl.textContent = "";
      notesEl.textContent = "";
      return;
    }

    // Basic info
    nameEl.textContent = task.name;
    metaEl.textContent = `${task.frequency_unit} · target ${task.times_per_frequency} · points ${task.points}`;
    notesEl.textContent = task.notes || "No notes.";

    // Period start/end for THIS task
    const unit = task.frequency_unit || "daily";
    const { start, end } = periodRange(unit, new Date());

    periodRangeEl.textContent = `Start: ${fmt(start)}  —  End: ${fmt(end)}`;

    // Completions inside this period
    const rows = await fetchCompletionDates(task.id, start.toISOString(), end.toISOString());
    periodCountEl.textContent = `Done this period: ${rows.length} / ${task.times_per_frequency}`;

    completionDatesEl.innerHTML = "";
    if (!rows.length) {
      noCompletionsEl.classList.remove("hidden");
    } else {
      noCompletionsEl.classList.add("hidden");
      rows.forEach(r => {
        const li = document.createElement("li");
      //  li.textContent = fmtDateOnly(r.done_at);
      li.textContent = fmt(r.done_at);

        completionDatesEl.appendChild(li);
      });
    }
  } catch (e) {
    console.error(e);
    mustLoginBox.classList.remove("hidden");
  }
}

load();
