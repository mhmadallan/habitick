import { requireUser, fetchTasks, addCompletion, updateTask, createMiss } from "./api.js";

const mustLoginBox = document.getElementById("mustLoginBox");
const aliveList = document.getElementById("aliveList");
const emptyAlive = document.getElementById("emptyAlive");

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function computeExpiredAt(task) {
  return addDays(new Date(task.next_due_at), Math.max(0, Number(task.grace_days ?? 3)));
}

async function normalizeTaskSchedule(task) {
  const now = new Date();
  let nextDue = new Date(task.next_due_at || now);
  const interval = Math.max(1, Number(task.interval_days || 1));
  const grace = Math.max(0, Number(task.grace_days ?? 3));

  while (addDays(nextDue, grace) < now) {
    const expiredAt = addDays(nextDue, grace);

    await createMiss({
      taskId: task.id,
      dueAt: nextDue.toISOString(),
      expiredAt: expiredAt.toISOString()
    });

    nextDue = addDays(nextDue, interval);
  }

  if (new Date(task.next_due_at).toISOString() !== nextDue.toISOString()) {
    await updateTask(task.id, { next_due_at: nextDue.toISOString() });
    return { ...task, next_due_at: nextDue.toISOString() };
  }

  return task;
}

async function completeTask(task) {
  const now = new Date();
  const dueAt = new Date(task.next_due_at);
  const expiredAt = computeExpiredAt(task);

  if (now > expiredAt) {
    alert("Expired. It will be recorded as missed.");
    await normalizeTaskSchedule(task);
    return;
  }

  const wasLate = now > dueAt;
  const earnedPoints = task.points; // still earn within grace

  await addCompletion(task, { earnedPoints, wasLate });

  const interval = Math.max(1, Number(task.interval_days || 1));
  const nextDue = addDays(now, interval);
  await updateTask(task.id, { next_due_at: nextDue.toISOString() });
}

function renderAlive(tasks) {
  aliveList.innerHTML = "";

  if (!tasks.length) {
    emptyAlive.classList.remove("hidden");
    return;
  }
  emptyAlive.classList.add("hidden");

  tasks.forEach(task => {
    const dueAt = new Date(task.next_due_at);
    const expiredAt = computeExpiredAt(task);
    const daysLeft = Math.max(0, Math.ceil((expiredAt - new Date()) / (1000 * 60 * 60 * 24)));

    const row = document.createElement("div");
    row.className = "flex items-center justify-between border rounded-xl px-3 py-2";

    const left = document.createElement("div");
    left.className = "flex flex-col";

    const title = document.createElement("div");
    title.className = "font-semibold";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    meta.textContent = `Due: ${dueAt.toLocaleDateString()} · expires in ${daysLeft} day(s) · points ${task.points}`;

    left.appendChild(title);
    left.appendChild(meta);

    const doneBtn = document.createElement("button");
    doneBtn.className = "px-3 py-1 rounded-lg bg-green-600 text-white text-xs";
    doneBtn.textContent = "Do it (earn points)";

    doneBtn.onclick = async () => {
      doneBtn.disabled = true;
      doneBtn.textContent = "Saving...";
      try {
        await completeTask(task);
        await loadAlive();
      } finally {
        doneBtn.disabled = false;
        doneBtn.textContent = "Do it (earn points)";
      }
    };

    row.appendChild(left);
    row.appendChild(doneBtn);
    aliveList.appendChild(row);
  });
}

async function loadAlive() {
  try {
    mustLoginBox.classList.add("hidden");
    await requireUser();

    const tasks = await fetchTasks();
    const now = new Date();
    const alive = [];

    for (let task of tasks) {
      if (!task.is_active) continue;

      task = await normalizeTaskSchedule(task);

      const dueAt = new Date(task.next_due_at);
      const expiredAt = computeExpiredAt(task);

      // Alive = overdue but not expired
      if (now > dueAt && now <= expiredAt) {
        alive.push(task);
      }
    }

    renderAlive(alive);
  } catch (e) {
    mustLoginBox.classList.remove("hidden");
    aliveList.innerHTML = "";
    emptyAlive.classList.add("hidden");
  }
}

loadAlive();
