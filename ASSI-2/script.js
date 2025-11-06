let tasks = [];

function signUp() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  if (username && password) {
    localStorage.setItem("user_" + username, password);
    alert("Sign up successful! You can now sign in.");
  } else {
    alert("Please enter both username and password.");
  }
}

function signIn() {
  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;
  const storedPassword = localStorage.getItem("user_" + username);

  if (password === storedPassword) {
    localStorage.setItem("loggedInUser", username);
    document.getElementById("auth-section").classList.add("d-none");
    document.getElementById("dashboard").classList.remove("d-none");
    loadTasks();
  } else {
    alert("Invalid credentials. Try again.");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("auth-section").classList.remove("d-none");
  document.getElementById("dashboard").classList.add("d-none");
}

function addTask() {
  const taskText = document.getElementById("task-input").value.trim();
  if (taskText) {
    tasks.push({ text: taskText, done: false });
    document.getElementById("task-input").value = "";
    saveTasks();
    displayTasks();
  }
}

function editTask(index) {
  const newTask = prompt("Edit your task:", tasks[index].text);
  if (newTask !== null) {
    tasks[index].text = newTask;
    saveTasks();
    displayTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  displayTasks();
}

function saveTasks() {
  const user = localStorage.getItem("loggedInUser");
  localStorage.setItem("tasks_" + user, JSON.stringify(tasks));
}

function loadTasks() {
  const user = localStorage.getItem("loggedInUser");
  const saved = localStorage.getItem("tasks_" + user);
  tasks = saved ? JSON.parse(saved) : [];
  displayTasks();
}

function displayTasks() {
  const pendingList = document.getElementById("pending-list");
  const doneList = document.getElementById("done-list");

  pendingList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="btn btn-sm btn-secondary me-2" onclick="editTask(${index})">Edit</button>
        <button class="btn btn-sm ${task.done ? 'btn-warning' : 'btn-success'}" onclick="toggleTask(${index})">
          ${task.done ? 'Undo' : 'Done'}
        </button>
      </div>
    `;
    if (task.done) {
      doneList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });
}
