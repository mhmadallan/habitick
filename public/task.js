import {
  requireUser,
  fetchTasks,
  fetchCompletionDates,
  fetchStudyItems,
  addStudyItem,
  deleteStudyItem
} from "./api.js";

const mustLoginBox = document.getElementById("mustLoginBox");
const nameEl = document.getElementById("name");
const metaEl = document.getElementById("meta");
const notesEl = document.getElementById("notes");

const periodRangeEl = document.getElementById("periodRange");
const periodCountEl = document.getElementById("periodCount");
const completionDatesEl = document.getElementById("completionDates");
const noCompletionsEl = document.getElementById("noCompletions");

const studySectionEl = document.getElementById("studySection");
const studyFormEl = document.getElementById("studyForm");
const studyTypeEl = document.getElementById("studyType");
const studyTextEl = document.getElementById("studyText");
const studyItemsEl = document.getElementById("studyItems");
const noStudyItemsEl = document.getElementById("noStudyItems");
const studyErrorEl = document.getElementById("studyError");

let currentTask = null;

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
  const d = toMidnight(date);
  const day = d.getDay();
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

function normalizeCategory(s) {
  return String(s || "").trim().toLowerCase();
}

function typeLabel(type) {
  if (type === "quran_verse") return "Quran verse";
  if (type === "german_word") return "German word";
  if (type === "book") return "Book";
  return "Other";
}

function showStudyError(message) {
  studyErrorEl.textContent = message || "";
  studyErrorEl.classList.toggle("hidden", !message);
}

function renderStudyItems(items) {
  studyItemsEl.innerHTML = "";

  if (!items.length) {
    noStudyItemsEl.classList.remove("hidden");
    return;
  }

  noStudyItemsEl.classList.add("hidden");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between border rounded-lg px-3 py-2 text-sm";

    const left = document.createElement("div");

    const text = document.createElement("div");
    text.className = "font-medium";
    text.textContent = item.item_text;

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    meta.textContent = `${typeLabel(item.item_type)} - ${fmt(item.created_at)}`;

    left.appendChild(text);
    left.appendChild(meta);

    const delBtn = document.createElement("button");
    delBtn.className = "px-2 py-1 rounded border border-red-500 text-red-600 text-xs";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (!confirm("Delete this study item?")) return;
      try {
        await deleteStudyItem(item.id);
        await loadStudyItems(currentTask.id);
      } catch (err) {
        console.error(err);
        showStudyError("Could not delete item.");
      }
    };

    li.appendChild(left);
    li.appendChild(delBtn);
    studyItemsEl.appendChild(li);
  });
}

async function loadStudyItems(taskId) {
  try {
    showStudyError("");
    const items = await fetchStudyItems(taskId);
    renderStudyItems(items);
  } catch (err) {
    console.error(err);
    renderStudyItems([]);
    showStudyError("Study log is not ready yet. Create the study_items table in Supabase first.");
  }
}

async function onAddStudyItem(e) {
  e.preventDefault();
  if (!currentTask) return;

  const item_text = studyTextEl.value.trim();
  if (!item_text) {
    alert("Please enter what you learned.");
    return;
  }

  try {
    showStudyError("");
    await addStudyItem(currentTask.id, {
      item_type: studyTypeEl.value,
      item_text
    });
    studyTextEl.value = "";
    await loadStudyItems(currentTask.id);
  } catch (err) {
    console.error(err);
    showStudyError("Could not add item. Check Supabase table/policies.");
  }
}

async function load() {
  try {
    mustLoginBox.classList.add("hidden");
    await requireUser();

    const id = getId();
    if (!id) {
      nameEl.textContent = "Task not found";
      return;
    }

    const tasks = await fetchTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      nameEl.textContent = "Task not found";
      metaEl.textContent = "";
      notesEl.textContent = "";
      studySectionEl.classList.add("hidden");
      return;
    }

    currentTask = task;

    nameEl.textContent = task.name;
    metaEl.textContent = `${task.frequency_unit} - target ${task.times_per_frequency} - points ${task.points}`;
    notesEl.textContent = task.notes || "No notes.";

    const unit = task.frequency_unit || "daily";
    const { start, end } = periodRange(unit, new Date());

    periodRangeEl.textContent = `Start: ${fmt(start)} - End: ${fmt(end)}`;

    const rows = await fetchCompletionDates(task.id, start.toISOString(), end.toISOString());
    periodCountEl.textContent = `Done this period: ${rows.length} / ${task.times_per_frequency}`;

    completionDatesEl.innerHTML = "";
    if (!rows.length) {
      noCompletionsEl.classList.remove("hidden");
    } else {
      noCompletionsEl.classList.add("hidden");
      rows.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = fmt(r.done_at);
        completionDatesEl.appendChild(li);
      });
    }

    const isStudyTask = normalizeCategory(task.category) === "study";
    if (isStudyTask) {
      studySectionEl.classList.remove("hidden");
      await loadStudyItems(task.id);
    } else {
      studySectionEl.classList.add("hidden");
    }
  } catch (e) {
    console.error(e);
    mustLoginBox.classList.remove("hidden");
  }
}

studyFormEl?.addEventListener("submit", onAddStudyItem);

load();
