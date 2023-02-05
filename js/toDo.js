import { changeActiveBtn, stop } from "./control.js";
import { state } from "./state.js";

const titleElem = document.querySelector('.title');
const countElem = document.querySelector('.count_num');
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
;
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
};

export const updateToDO = (toDo) => {
    const toDoList = getToDo();
    if (!toDoList.length) {
        return;
    }
    const toDoItem = toDoList.find((item) => item.id === toDo.id);
    toDoItem.title = toDo.title;
    toDoItem.pomodoro = toDo.pomodoro;
    localStorage.setItem('pomodoro', JSON.stringify(toDoList));
};

const deleteToDo = (toDo) => {
    const toDoList = getToDo();
    const newToDoList = toDoList.filter((item) => item.id !== toDo.id);
    if (toDo.id === state.activeToDo.id) {
        state.activeToDo = newToDoList[newToDoList.length - 1];
    }
    localStorage.setItem('pomodoro', JSON.stringify(newToDoList));
};

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
            state.activeToDo = toDo;
            showToDO();
            changeActiveBtn('work');
            stop();
        })
        
        editBtn.addEventListener('click', () => {
            toDo.title = prompt('Введите новое название задачи', toDo.title);
            toDoBtn.textContent = toDo.title;
            if (toDo.id === state.activeToDo.id) {
                state.activeToDo.title = toDo.title;
            }
            showToDO();
            updateToDO(toDo);
        });
        
        delBtn.addEventListener('click', () => {
            deleteToDo(toDo);
            showToDO();
            toDoItem.remove();
        });
    }
};


const renderToDoList = (list) => {
    toDoListElem.textContent = '';
    list.forEach(createToDoListItem);
    toDoListElem.append(li);
};

export const showToDO = () => {
    if (state.activeToDo) {
        titleElem.textContent = state.activeToDo.title;
        countElem.textContent = state.activeToDo.pomodoro;
    } else {
        titleElem.textContent = '';
        countElem.textContent = 0;
    }
};

export const initToDo = () => {
    const toDoList = getToDo();

    if (!toDoList.length) {
        state.activeToDo = {
            id: 'default',
            pomodoro: 0,
            title: 'Нет задач',
        };
    } else {
        state.activeToDo = toDoList[toDoList.length - 1];
    }

    showToDO();
    renderToDoList(toDoList);

    toDoAddBtn.addEventListener('click', () => {
        const title = prompt('Введите название задачи');
        const toDo = addToDo(title);
        createToDoListItem(toDo);
        /*
        есди нужно сделать добавляемую задачу активной
        state.activeToDo = toDo;
        showToDO();
        */
    })
}
