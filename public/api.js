import { supabase } from "./auth.js";

export async function requireUser() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;
  if (!user) throw new Error("Not signed in");
  return user;
}

// TASKS
export async function fetchTasks() {
  await requireUser();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask(task) {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ user_id: user.id, ...task })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id, patch) {
  await requireUser();
  const { data, error } = await supabase
    .from("tasks")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  await requireUser();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

// COMPLETIONS
export async function addCompletion(task) {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("completions")
    .insert({
      user_id: user.id,
      task_id: task.id,
      points_at_completion: task.points
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

// ✅ Needed by Progress and by Due logic
export async function fetchCompletionDates(taskId, startISO, endISO) {
  await requireUser();
  const { data, error } = await supabase
    .from("completions")
    .select("done_at, points_at_completion")
    .eq("task_id", taskId)
    .gte("done_at", startISO)
    .lt("done_at", endISO)
    .order("done_at", { ascending: true });
  if (error) throw error;
  return data;
}

// Get all completions for the current user in a time range (for points totals)
export async function fetchCompletionsInRange(startISO, endISO) {
  await requireUser();

  const { data, error } = await supabase
    .from("completions")
    .select("done_at, points_at_completion, task_id")
    .gte("done_at", startISO)
    .lt("done_at", endISO)
    .order("done_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get completions for a single task since a given date (for streak calc)
export async function fetchTaskCompletionsSince(taskId, startISO) {
  await requireUser();

  const { data, error } = await supabase
    .from("completions")
    .select("done_at, points_at_completion")
    .eq("task_id", taskId)
    .gte("done_at", startISO)
    .order("done_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchLastCompletion(taskId) {
  await requireUser();

  const { data, error } = await supabase
    .from("completions")
    .select("done_at")
    .eq("task_id", taskId)
    .order("done_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null; // { done_at } or null
}

// STUDY ITEMS (per-task learning log)
export async function fetchStudyItems(taskId) {
  await requireUser();
  const { data, error } = await supabase
    .from("study_items")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addStudyItem(taskId, item) {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("study_items")
    .insert({
      user_id: user.id,
      task_id: taskId,
      item_type: item.item_type,
      item_text: item.item_text
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStudyItem(itemId) {
  await requireUser();
  const { error } = await supabase.from("study_items").delete().eq("id", itemId);
  if (error) throw error;
}


