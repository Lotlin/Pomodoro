import { alarm } from './alarm.js';
import { changeActiveBtn } from './control.js';
import { state } from './state.js';
import { showToDO, updateToDO } from './toDo.js';
import { addZero } from './util.js';

const minutesElem = document.querySelector('.time__minutes');
const secondsElem = document.querySelector('.time__seconds');

export const showTime = (seconds) => {
    minutesElem.textContent = addZero(Math.floor(seconds / 60));
    secondsElem.textContent = addZero(seconds % 60);
}

const title = document.title;

export const startTimer = () => {
    const countdown = new Date().getTime() + state.timeLeft * 1000;
    state.timerId = setInterval(()=> {
        state.timeLeft -= 1;
        showTime(state.timeLeft);
        document.title = state.timeLeft;
        if (!(state.timeLeft % 5)) {
            const now = new Date().getTime();
            state.timeLeft = Math.floor((countdown - now) / 1000);
            // console.log('синхронизация времени');
        }
        if (state.timeLeft > 0 && state.isActive)  {
            return;
        }
        document.title = title;
        clearTimeout(state.timerId);
        if (state.status === 'work') {
            state.activeToDo.pomodoro += 1;
            updateToDO(state.activeToDo);
            if (state.activeToDo.pomodoro % state.count) {
                state.status = 'break';
            } else {
                state.status = 'relax';
            }
        } else {
            state.status = 'work';
        }
        alarm();
        state.timeLeft = state[state.status] * 60;  
        changeActiveBtn(state.status);
        showToDO();
        startTimer();
    }, 1000);
}