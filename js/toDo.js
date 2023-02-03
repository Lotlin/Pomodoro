import { state } from "./state.js";

const titleElem = document.querySelector('.title');
const countPomodoro = document.querySelector('.count_num');
const toDoListElem = document.querySelector('.todo__list');

const li = document.createElement('li');
li.classList.add('.todo__item');

const toDoAddBtn = document.createElement('button');
toDoAddBtn.classList.add('todo__add');
toDoAddBtn.textContent = 'Добавить новую задачу';
li.append(toDoAddBtn);

const getToDo = () => {
    const toDoList = (JSON.parse(localStorage.getItem('pomodoro') || '[]'));
    return toDoList;
}

const addToDo = (title) => {
    const toDo = {
        title,
        pomodoro: 0,
        id: Math.random().toString(16).substring(2,8),
    }
    const toDoList = getToDo();
    toDoList.push(toDo);

    localStorage.setItem('pomodoro', JSON.stringify(toDoList));
    return toDo;
}

const delToDo = (id) => {
    const toDoList = getToDo();
    const newToDoList = [];

    for (let i = 0; i < toDoList.length; i++) {
        if (id === toDoList[i].id) {
            delete toDoList[i];
        } else {
            const savedTask = JSON.parse(localStorage.getItem('pomodoro'))[i];
            newToDoList.push(savedTask);
        }
    }
    localStorage.removeItem('pomodoro');
    localStorage.setItem('pomodoro', JSON.stringify(newToDoList));
    const changedToDoList = (JSON.parse(localStorage.getItem('pomodoro')));
    return renderToDoList(changedToDoList);
}

const createToDoListItem = (toDo) => { 
    if (toDo.id !== 'default') {
        const toDoItem = document.createElement('li');
        toDoItem.classList.add('todo__item');

        const toDoItemWrapper = document.createElement('div');
        toDoItemWrapper.classList.add('todo__item-wrapper');
        toDoItem.append(toDoItemWrapper);

        const toDoBtn = document.createElement('button');
        toDoBtn.classList.add('todo__btn');
        toDoBtn.textContent = toDo.title;

        const editBtn = document.createElement('button');
        editBtn.classList.add('todo__edit');
        editBtn.ariaLabel = 'Редактировать задачу';


        const delBtn = document.createElement('button');
        delBtn.classList.add('todo__del');
        delBtn.ariaLabel = 'Удалить задачу';

        toDoItemWrapper.append(toDoBtn, editBtn, delBtn);

        toDoListElem.prepend(toDoItem);

        toDoBtn.addEventListener('click', () => {
            state.activeToDo.title = toDoBtn.textContent;
            showToDO();
        })
        editBtn.addEventListener('click', () => {
            const title = prompt('Введите новое название задачи');
            const toDo = addToDo(title);
            toDoBtn.textContent = toDo.title;
        })
        delBtn.addEventListener('click', () => {
            const id = toDo.id;
            delToDo(id);
        })
    }
}


const renderToDoList = (list) => {
    toDoListElem.textContent = '';
    list.forEach(createToDoListItem);
    toDoListElem.append(li);
}

const showToDO = () => {
    titleElem.textContent = state.activeToDo.title;
}

const showCountPomodoro = () => {
    countPomodoro.textContent = state.activeToDo.pomodoro;
}

export const initToDo = () => {
    const toDoList = getToDo();

    if (!toDoList.length) {
        state.activeToDo = [{
            id: 'default',
            pomodoro: 0,
            title: 'Помодоро',
        }]
    } else {
        state.activeToDo = toDoList[toDoList.length - 1];
    }

    showToDO();
    showCountPomodoro();
    renderToDoList(toDoList);

    toDoAddBtn.addEventListener('click', () => {
        const title = prompt('Введите название задачи');
        const toDo = addToDo(title);
        createToDoListItem(toDo);
    })
}
