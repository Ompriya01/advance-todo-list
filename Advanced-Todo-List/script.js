const inputBox = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");  // ✅ Added
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task
addBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = inputBox.value.trim();
    const dueDate = dateInput.value;    // ✅ Added

    if (taskText === "") return alert("Enter a task!");
    if (dueDate === "") return alert("Select a due date!");  // ✅ Added

    createTaskElement(taskText, false, dueDate);
    saveTask(taskText, false, dueDate);

    inputBox.value = "";
    dateInput.value = "";
}

// Create task UI
function createTaskElement(text, completed, dueDate) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    li.innerHTML = `
        <div>
            <span class="task-text">${text}</span>
            <br>
            <small class="due-info">${formatDueDate(dueDate)}</small>   <!-- ✅ Added -->
        </div>

        <div class="buttons">
            <button class="edit">Edit</button>
            <button class="delete">X</button>
        </div>
    `;

    // Toggle completed
    li.querySelector(".task-text").addEventListener("click", () => {
        li.classList.toggle("completed");
        updateStorage();
    });

    // Edit task
    li.querySelector(".edit").addEventListener("click", () => {
        const newText = prompt("Edit your task:", text);
        if (newText) {
            li.querySelector(".task-text").innerText = newText;
            updateStorage();
        }
    });

    // Delete task
    li.querySelector(".delete").addEventListener("click", () => {
        li.remove();
        updateStorage();
    });

    taskList.appendChild(li);
}

// Calculate Days Left / Overdue
function formatDueDate(dueDate) {     // ✅ Added
    const today = new Date();
    const due = new Date(dueDate);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "❌ Overdue";
    if (diff === 0) return "⭐ Due Today";
    return  `${diff} days left`;
}

// Save tasks to localStorage
function saveTask(text, completed, dueDate) {   // ✅ Modified
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text, completed, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed, task.dueDate));   // ✅ Added
}

// Update localStorage
function updateStorage() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerText,
            completed: li.classList.contains("completed"),
            dueDate: li.querySelector(".due-info").innerText   // ❗ This stays
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        document.querySelectorAll("li").forEach(li => {
            if (filter === "all") li.style.display = "flex";
            else if (filter === "completed" && !li.classList.contains("completed"))
                li.style.display = "none";
            else if (filter === "pending" && li.classList.contains("completed"))
                li.style.display = "none";
            else li.style.display = "flex";
        });
    });
});

// Dark mode toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.innerText = 
        document.body.classList.contains("dark") 
        ? "☀ Light Mode" 
        : "🌙 Dark Mode";
});