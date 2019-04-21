console.log('Hello Coders in hoods');
// API END POINTS
const TASKS_URL = 'http://localhost:3000/todos';

// DOM elements
const taskFormEl = document.querySelector('.todo_app__header__form');
const taskListEl = document.querySelector('.todo_app__list');
let tasks = [];

// DB queries

// Get Tasks/Task from DB
const fetchData = async (url) => {
    return fetch(url)
        .then(resp => resp.json())
        .catch(error => console.error('GET ERROR: ', error))
};

// Add Task to DB
const addTaskToDB = async (url, task) => {
    const params = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    };

    return fetch(url, params)
        .then(resp => resp.json())
        .catch(error => console.error('POST ERROR: ', error))
};

// Modify Task in DB
const changeTaskInDB = async (url, task) => {
    const params = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    };

    return fetch(url, params)
        .then(resp => resp.json())
        .catch(error => console.error('PUT ERROR: ', error))
};

const deleteTaskFromDB = async (url) => {
    const params = {method: 'DELETE'};
    return fetch(url, params)
        .then(resp => resp.json())
        .catch(error => console.error('DELETE ERROR: ', error))
};

// =========================

// Render tasks
const renderTasks = tasks => {
    tasks.forEach(task => {
        renderTask(task)
    })
};

// Render task
const renderTask = task => {
    const taskEl = document.createElement('li');
    taskEl.classList.add('todo_app__list__item');
    task.completed ? taskEl.classList.add('completed') : taskEl.classList.remove('completed');
    taskEl.setAttribute('data-task-id', task.id);

    taskEl.innerHTML = `
        <p class="todo_app__list__item__text">${task.task}</p>
        <button class="todo_app__list__item__delete">x</button>`;

    taskListEl.prepend(taskEl);
};

// Change completion status
const toggleCompletion = async taskEl => {
    const taskURL = `${TASKS_URL}/${taskEl.dataset.taskId}`;
    const modifiedTask = {
        task: taskEl.querySelector('p').innerText,
        completed: !taskEl.classList.contains('completed')
    };

    const serverResponse = await changeTaskInDB(taskURL, modifiedTask);

    // Check for successful PUT request
    serverResponse && taskEl.classList.toggle('completed');
};

const deleteTask = async (taskEl) => {
    const listItem = taskEl.parentNode;
    const deleteUrl = `${TASKS_URL}/${listItem.dataset.taskId}`;
    const serverResponse = await deleteTaskFromDB(deleteUrl);

    // Check for successful DELETE request
    serverResponse && listItem.remove();
};

// Handle form submission event
const handleFormSubmit = async event => {
    event.preventDefault();

    const userInputValue = event.target.newTodo.value;
    const newTodoObj = {
        task: userInputValue,
        completed: false
    };
    const serverResponse = await addTaskToDB(TASKS_URL, newTodoObj);

    if (serverResponse) {
        renderTask(serverResponse);
        event.target.reset()
    }
};

// Page loaded listener
document.addEventListener('DOMContentLoaded', async event => {
    const tasks = await fetchData(TASKS_URL);

    // Check for successful GET request
    tasks && renderTasks(tasks);
});

// Form submit listener
taskFormEl.addEventListener('submit', handleFormSubmit);

// Task list listener - listen clicks on each task
taskListEl.addEventListener('click', event => {
    const clickedEl = event.target;

    clickedEl.classList.contains('todo_app__list__item') && toggleCompletion(clickedEl);
    clickedEl.classList.contains('todo_app__list__item__delete') && deleteTask(clickedEl)
});
