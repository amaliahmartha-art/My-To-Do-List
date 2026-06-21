// Check localStorage for existing items. If empty, apply default tasks.
let savedTasks = localStorage.getItem('amaliahTasks');
let tasks = savedTasks ? JSON.parse(savedTasks) : [
    { id: 1, text: 'Welcome to Amaliahs Task Manager!', completed: false, createdAt: Date.now() },
    { id: 2, text: 'Add tasks using the input above', completed: false, createdAt: Date.now() },
    { id: 3, text: 'Click checkbox to mark tasks completed', completed: false, createdAt: Date.now() },
    { id: 4, text: 'Click delete to remove tasks', completed: false, createdAt: Date.now() }
];

// Ensure new IDs don't conflict with existing items
let taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Persistent storage engine
function saveToLocalStorage() {
    localStorage.setItem('amaliahTasks', JSON.stringify(tasks));
}

// Create/Add Tasks
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(task);
    taskInput.value = '';
    
    saveToLocalStorage();
    renderTasks();
    updateStats();
}

// Delete Tasks
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    saveToLocalStorage();
    renderTasks();
    updateStats();
}

// Update/Toggle Completion Status
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        
        saveToLocalStorage();
        renderTasks();
        updateStats();
    }
}

function renderTasks() {
    todoList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <span class="todo-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        todoList.appendChild(li);
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

// Security layer: Prevents malicious script execution from input forms
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize display from localStorage data source on load
renderTasks();
updateStats();