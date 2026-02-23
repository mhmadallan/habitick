import {
  requireUser,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  addCompletion,
  fetchCompletionDates,
  fetchLastCompletion,
} from "./api.js";

// ---------- DOM ----------
const mustLoginBox = document.getElementById("mustLoginBox");
const refreshBtn = document.getElementById("refreshBtn");

const dueList = document.getElementById("dueList");
const emptyDue = document.getElementById("emptyDue");

const allTasksList = document.getElementById("allTasksList");
const emptyAll = document.getElementById("emptyAll");

const taskForm = document.getElementById("taskForm");
const resetBtn = document.getElementById("resetBtn");

const taskId = document.getElementById("taskId");
const nameEl = document.getElementById("name");
const frequencyUnitEl = document.getElementById("frequencyUnit");
const timesPerFrequencyEl = document.getElementById("timesPerFrequency");
const pointsEl = document.getElementById("points");
const categoryEl = document.getElementById("category");
const estimatedMinutesEl = document.getElementById("estimatedMinutes");
const notesEl = document.getElementById("notes");
const isActiveEl = document.getElementById("isActive");

const aiPointsBtn = document.getElementById("aiPointsBtn");
const aiReason = document.getElementById("aiReason");

const minGapDaysEl = document.getElementById("minGapDays");


// ---------- period helpers ----------
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


function daysLeftUntil(date) {
  const ms = new Date(date) - new Date();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
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

// ---------- compute due tasks ----------
async function computeDueTasks(tasks) {
  const now = new Date();
  const due = [];

  for (const task of tasks) {
    if (!task.is_active) continue;

    const unit = task.frequency_unit || "daily";
    const target = Number(task.times_per_frequency || 1);

    const { start, end } = periodRange(unit, now);
    const rows = await fetchCompletionDates(task.id, start.toISOString(), end.toISOString());
    const doneCount = rows.length;

    if (doneCount < target) {
      due.push({ ...task, doneCount });
    }
  }

  return due;
}

// ---------- UI render ----------
function renderDue(tasks) {
  dueList.innerHTML = "";

  if (!tasks.length) {
    emptyDue.classList.remove("hidden");
    return;
  }
  emptyDue.classList.add("hidden");

  tasks.forEach(task => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between border rounded-xl px-3 py-2";

    const left = document.createElement("div");
    left.className = "flex flex-col";

    const title = document.createElement("div");
    title.className = "font-semibold";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    meta.textContent = `${task.frequency_unit} · ${task.doneCount ?? 0}/${task.times_per_frequency} this period · points ${task.points}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "flex gap-2";

    const doneBtn = document.createElement("button");
    doneBtn.className = "px-3 py-1 rounded-lg bg-green-600 text-white text-xs";
    doneBtn.textContent = "Mark done";
    /* doneBtn.onclick = async () => {
       doneBtn.disabled = true;
       doneBtn.textContent = "Saving...";
       try {
         // await addCompletion(task);
         function addDays(date, days) {
           const d = new Date(date);
           d.setDate(d.getDate() + days);
           return d;
         }
 
         function daysLeftUntil(date) {
           const ms = new Date(date) - new Date();
           return Math.ceil(ms / (1000 * 60 * 60 * 24));
         }
         await loadAndRender();
       } finally {
         doneBtn.disabled = false;
         doneBtn.textContent = "Mark done";
       }
     };*/
    doneBtn.onclick = async () => {
      doneBtn.disabled = true;
      doneBtn.textContent = "Saving...";
      try {
        const gap = Number(task.min_gap_days || 0);

        if (gap > 0) {
          const last = await fetchLastCompletion(task.id);
          if (last?.done_at) {
            const nextAllowed = addDays(last.done_at, gap);
            if (new Date() < nextAllowed) {
              const left = daysLeftUntil(nextAllowed);
              alert(`Too soon. You can log this task again in ${left} day(s).`);
              return;
            }
          }
        }

        await addCompletion(task);
        await loadAndRender();
      } finally {
        doneBtn.disabled = false;
        doneBtn.textContent = "Mark done";
      }
    };


    right.appendChild(doneBtn);

    row.appendChild(left);
    row.appendChild(right);
    dueList.appendChild(row);
  });
}

function renderAll(tasks) {
  allTasksList.innerHTML = "";

  if (!tasks.length) {
    emptyAll.classList.remove("hidden");
    return;
  }
  emptyAll.classList.add("hidden");

  tasks.forEach(task => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between border rounded-xl px-3 py-2";

    const left = document.createElement("div");
    left.className = "flex flex-col";

    const title = document.createElement("div");
    title.className = "font-semibold";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    meta.textContent = `${task.frequency_unit} · target ${task.times_per_frequency} · points ${task.points} · ${task.is_active ? "active" : "paused"}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "flex gap-2";

    const editBtn = document.createElement("button");
    editBtn.className = "px-3 py-1 rounded-lg border text-xs";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => fillForm(task);

    const delBtn = document.createElement("button");
    delBtn.className = "px-3 py-1 rounded-lg border border-red-500 text-red-600 text-xs";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (!confirm("Delete this task?")) return;
      await deleteTask(task.id);
      await loadAndRender();
    };

    right.appendChild(editBtn);
    right.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(right);
    allTasksList.appendChild(row);
  });
}

function fillForm(task) {
  taskId.value = task.id;
  nameEl.value = task.name || "";
  frequencyUnitEl.value = task.frequency_unit || "daily";
  timesPerFrequencyEl.value = task.times_per_frequency ?? 1;
  pointsEl.value = task.points ?? 0;
  categoryEl.value = task.category || "";
  estimatedMinutesEl.value = task.estimated_minutes ?? "";
  notesEl.value = task.notes || "";
  isActiveEl.checked = !!task.is_active;
  minGapDaysEl.value = task.min_gap_days ?? 0;

  aiReason.classList.add("hidden");
  aiReason.textContent = "";
}

function resetForm() {
  taskId.value = "";
  taskForm.reset();

  frequencyUnitEl.value = "daily";
  timesPerFrequencyEl.value = 1;
  pointsEl.value = 0;
  isActiveEl.checked = true;

  minGapDaysEl.value = 0;

  aiReason.classList.add("hidden");
  aiReason.textContent = "";
}

// ---------- load ----------
async function loadAndRender() {
  try {
    mustLoginBox.classList.add("hidden");
    await requireUser();

    const tasks = await fetchTasks();
    renderAll(tasks);

    const due = await computeDueTasks(tasks);
    renderDue(due);
  } catch (err) {
    console.error(err);
    // show login box only if not logged in (simple approach)
    mustLoginBox.classList.remove("hidden");
    dueList.innerHTML = "";
    allTasksList.innerHTML = "";
    emptyDue.classList.add("hidden");
    emptyAll.classList.add("hidden");
  }
}

// ---------- events ----------
refreshBtn?.addEventListener("click", loadAndRender);
resetBtn?.addEventListener("click", resetForm);

taskForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameEl.value.trim(),
    frequency_unit: frequencyUnitEl.value,
    times_per_frequency: Number(timesPerFrequencyEl.value),
    points: Number(pointsEl.value) || 0,
    category: categoryEl.value.trim(),
    estimated_minutes: estimatedMinutesEl.value ? Number(estimatedMinutesEl.value) : null,
    notes: notesEl.value.trim(),
    is_active: isActiveEl.checked,
    min_gap_days: Number(minGapDaysEl.value) || 0,

  };

  if (!payload.name) {
    alert("Please enter a name");
    return;
  }

  if (!payload.frequency_unit) {
    alert("Please choose frequency");
    return;
  }

  if (!payload.times_per_frequency || payload.times_per_frequency < 1) {
    alert("Times per frequency must be at least 1");
    return;
  }

  const id = taskId.value;
  if (id) {
    await updateTask(Number(id), payload);
  } else {
    await createTask(payload);
  }

  resetForm();
  await loadAndRender();
});

// AI points (calls Node backend)
aiPointsBtn?.addEventListener("click", async () => {
  try {
    await requireUser();

    const payload = {
      name: nameEl.value.trim(),
      frequencyUnit: frequencyUnitEl.value,
      timesPerFrequency: Number(timesPerFrequencyEl.value),
      category: categoryEl.value.trim(),
      estimatedMinutes: estimatedMinutesEl.value ? Number(estimatedMinutesEl.value) : null
    };

    if (!payload.name) {
      alert("Enter a task name first");
      return;
    }

    aiPointsBtn.disabled = true;
    aiPointsBtn.textContent = "Thinking...";

    const res = await fetch("/api/ai/points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("AI points failed");
    const data = await res.json();

    pointsEl.value = data.points ?? 0;
    if (data.reason) {
      aiReason.textContent = data.reason;
      aiReason.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    alert("AI points failed (or you are not signed in).");
  } finally {
    aiPointsBtn.disabled = false;
    aiPointsBtn.textContent = "AI points";
  }
});

// start
loadAndRender();
