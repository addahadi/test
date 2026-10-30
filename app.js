// Small JavaScript app for a beginner-friendly Git workshop.
// No packages, build step, or server required.
const STORAGE_KEY = "git-workshop-study-tasks";
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");

const starterTasks = [
  { id: "example-1", title: "Learn git init and git status", completed: false },
  { id: "example-2", title: "Make my first commit", completed: false },
  { id: "example-3", title: "Create a feature branch", completed: false }
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [...starterTasks];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...starterTasks];
  } catch {
    return [...starterTasks];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();
  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remaining} remaining`;
  emptyState.hidden = tasks.length !== 0;

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.title;
    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(label, deleteButton);
    taskList.appendChild(item);
  }
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.push({
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title,
    completed: false
  });
  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

renderTasks();
