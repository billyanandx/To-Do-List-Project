document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    updateClock();
    setInterval(updateClock, 1000);

    // Event listener untuk submit form
    document.getElementById("taskForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Mencegah reload
        addTask();
    });

    // Event listener untuk pencarian task
    document.getElementById("search").addEventListener("input", searchTask);
});

// Realtime Clock
function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleString("id-ID", { 
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
}
setInterval(updateClock, 1000);

// Tambah Task
function addTask() {
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("description").value.trim();
    let deadline = document.getElementById("deadline").value;

    if (title.length < 5 || title.length > 25 || description.length < 20 || description.length > 100) {
        alert("Judul harus 5-25 karakter & Deskripsi harus 20-100 karakter!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ title, description, deadline, done: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("deadline").value = "";

    loadTasks();
}

// Load Tasks dari Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add("task-item");

        let text = document.createElement("div");
        text.classList.add("task-text");
        text.innerHTML = `<strong>${task.title}</strong> - ${task.description} <br> 
                          <span class="task-deadline">(Deadline: ${task.deadline || "N/A"})</span>`;

        let actions = document.createElement("div");
        actions.classList.add("task-actions");

        let doneBtn = document.createElement("button");
        doneBtn.innerHTML = "✔";
        doneBtn.classList.add("done");
        doneBtn.onclick = () => toggleDone(index);

        let editBtn = document.createElement("button");
        editBtn.innerHTML = "✎";
        editBtn.classList.add("edit");
        editBtn.onclick = () => editTask(index);

        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑";
        deleteBtn.classList.add("delete");
        deleteBtn.onclick = () => deleteTask(index);

        actions.append(doneBtn, editBtn, deleteBtn);
        li.append(text, actions);
        taskList.appendChild(li);
    });
}

// Toggle Task Selesai
function toggleDone(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].done = !tasks[index].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// Edit Task
function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let newTitle = prompt("Edit Judul:", tasks[index].title);
    let newDesc = prompt("Edit Deskripsi:", tasks[index].description);
    
    if (newTitle && newDesc) {
        tasks[index].title = newTitle;
        tasks[index].description = newDesc;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

// Hapus Task
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// Cari Task
function searchTask() {
    let search = document.getElementById("search").value.toLowerCase();
    let tasks = document.querySelectorAll(".task-item");

    tasks.forEach(task => {
        task.style.display = task.innerText.toLowerCase().includes(search) ? "flex" : "none";
    });
}
