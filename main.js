'use strict';

(function() {

    let todos = [];


    const bodyDay = document.querySelector('.body__day');
    const bodyDate = document.querySelector('.body__date');
    const todoAddBtn = document.querySelector('.todo__btn');
    const todoInput = document.querySelector('.todo__input');
    const todoNumber = document.querySelector('.todo__number');
    const showCompBtn = document.querySelector('.footer__btn-complete');
    const todoListPending = document.querySelector('.todo__list--pending');
    const todoListDone = document.querySelector('.todo__list__done');
    const completedSection = document.querySelector('.completed__section');
    const completedNumber = document.querySelector('.completed__number');
    const clearAllBtn = document.querySelector('.footer__btn-clear');


    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const localDB = {
        setItem(key, value) {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        },
        getItem(key) {
            const value = localStorage.getItem(key);
            if (value) {
                return null;
            }
            return JSON.parse(value);
        },

        removeItem(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }

    };

    const init = () => {
        showDate();
        setListeners();
        loadExistingTodos();
        todoInput.focus();
    };

    const loadExistingTodos = () => {
        const savedTodos = localDB.getItem('todos');
        if (savedTodos) {
            todos = savedTodos;
        }

        if (todos && Array.isArray(todos)) {
            todos.forEach(todo => showTodo(todo));
        }
    };

    const showDate = () => {
        const currentDate = new Date();
        const day = [
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getFullYear(),
        ].map(num => num < 10 ? `0${num}` : num);

        bodyDay.textContent = dayNames[currentDate.getDay()];
        bodyDate.textContent = day.join('-');
    };

    const setListeners = () => {
        todoAddBtn.addEventListener('click', addNewTodo);
        clearAllBtn.addEventListener('click', clearAllTodo);
        showCompBtn.addEventListener('click', showCompleted);
    };

    const showCompleted = (event) => {
        if (completedSection.style.display == 'block') {
            completedSection.style.display = 'none';
            showCompBtn.textContent = 'Show Complete';
        } else {
            completedSection.style.display = 'block';
            showCompBtn.textContent = 'Hide Complete';
        };
        todoInput.focus();
    }

    const clearAllTodo = () => {
        todoListPending.innerHTML = '';
        todoListDone.innerHTML = '';
        localDB.clear();
        todoInput.focus();
        todoNumber.textContent = todoListPending.childElementCount;
        completedNumber.textContent = percentage(todoListDone.childElementCount + todoListPending.childElementCount, todoListDone.childElementCount);
    };

    const addNewTodo = () => {
        const value = todoInput.value;
        if (value === '') {
            alert('Please type a todo.');
            return;

        }
        const todo = {
            text: value,
            done: false
        };
        todos.push(todo);


        localDB.setItem('todos', todos);

        showTodo(todo);

        todoInput.value = '';

    };

    const showTodo = todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todoItemPending';
        todoListPending.appendChild(todoItem);

        todoItem.innerHTML = `
        <input type="checkbox" class="todoItemCheckBox">
        <span>${todo.text}</span>
        <button class="btn_trash">
            <i class="fa fa-trash"></i>
        </button>    
    `;
        todoNumber.textContent = todoListPending.childElementCount;
        completedNumber.textContent = percentage(todoListDone.childElementCount + todoListPending.childElementCount, todoListDone.childElementCount);
        todoItem.querySelector('.btn_trash').addEventListener('click', () => {
            deleteItem(todoListPending, todoItem)
        });

        const completedCheckBox = todoItem.querySelector('.todoItemCheckBox');
        completedCheckBox.addEventListener('click', (completedCheckBox) => {
            if (completedCheckBox.currentTarget.checked) {
                moveItemToCompleted(todoItem);
            } else {
                moveItemToPending(todoItem);
            };
            todoInput.focus();
        });
        todoInput.focus();
    };

    function deleteItem(List, item) {
        localDB.removeItem(item);
        List.removeChild(item);
        todoInput.focus();
        todoNumber.textContent = todoListPending.childElementCount;
        completedNumber.textContent = percentage(todoListDone.childElementCount + todoListPending.childElementCount, todoListDone.childElementCount);
    };

    function moveItemToPending(todoItem) {
        if (todoListDone.contains(todoItem)) {
            todoListDone.removeChild(todoItem);
        }
        todoItem.className = 'todoItemPending';
        todoListPending.appendChild(todoItem);
        todoItem.querySelector('.btn_trash').addEventListener('click', () => {
            deleteItem(todoListPending, todoItem)
        });
        todoNumber.textContent = todoListPending.childElementCount;
        completedNumber.textContent = percentage(todoListDone.childElementCount + todoListPending.childElementCount, todoListDone.childElementCount);
    }

    function moveItemToCompleted(todoItem) {
        todoItem.className = 'todoItemCompleted';
        todoListPending.removeChild(todoItem);
        todoListDone.appendChild(todoItem);
        todoItem.querySelector('.btn_trash').addEventListener('click', () => {
            deleteItem(todoListDone, todoItem)
        });
        todoNumber.textContent = todoListPending.childElementCount;
        completedNumber.textContent = percentage(todoListDone.childElementCount + todoListPending.childElementCount, todoListDone.childElementCount);
    }

    const percentage = (totalValue, partialValue) => {
        if (totalValue == 0) return 0;
        else return Math.round((100 * partialValue) / totalValue);
    }
    init();
})();