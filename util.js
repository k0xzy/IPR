import { SharedArray } from 'k6/data';

export function getRandomValue() {
    return Math.floor(Math.random() * 9) + 1;
}

const underArray = ['Under0','Under1', 'Under2', 'Under3', 'Under4', 'Under5', 'Under6', 'Under7', 'Under8', 'Under9']
const themesArray = ['Theme1','Theme2','Theme3','Theme4','Theme5','Theme6','Theme7','Theme8','Theme9','Theme10']
export let underArrays = underArray[getRandomValue()];
export let themesArrays = themesArray[getRandomValue()] 


const RandomIds = new SharedArray('RandomIds', function () {
    return JSON.parse(open('random_ids.json'));
});
const SequentialMessages = new SharedArray('sequentialMessages', function () {
    return JSON.parse(open('sequential_messages.json'));
});

let sequentialIndex = 0;

// Функция для получения параметра случайным образом
export function getRandomIds() {
    const randomIndex = Math.floor(Math.random() * RandomIds.length);
    return RandomIds[randomIndex];
}

// Функция для последовательного выбора параметра
export function getSequentialMessages() {
    const param = SequentialMessages[sequentialIndex];
    sequentialIndex = (sequentialIndex + 1) % SequentialMessages.length;
    return param;
}

// Функция, возвращающая сумму текущего времени в секундах и целочисленного значения
function getCurrentTimeInSeconds() {
    const now = new Date();
    const secondsSinceStartOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return secondsSinceStartOfDay;
}

function addCurrentTime(value) {
    const currentTime = getCurrentTimeInSeconds();
    return currentTime + value;
}
export let offsetTime = addCurrentTime(getRandomValue());

export const login = "test2023-01@mail.ru";
export const pwd = "RbdjACPS2013";

//Последовательная функция
function createSequentialSelector(array) {
    let index = 0;

    return function() {
        const item = array[index];
        index = (index + 1) % array.length;
        return item; 
    }; 
}
export let under = underArray[1];
export let themes = themesArray[1];
export const dwhsplit = "s10273.b1ss12743s";
export const authid = "3Dlnsy5wy8.lrf";
export const Test2023 = "a956c3d2827ede38fdc720bd09da3079:On8WaDRPcHFAYEQmyekZj4IXJtwocoVLeqMPzW2dz8N7InRpbWUiOjE2OTc0NjQwMDQsInR5cGUiOiJjc3JmIiwibm9uY2UiOiI4ZTE2ZjY1NDQ0MmYyOTczIn0";
export const Default = "6789g01h237ede38fdc720bd09da3079:b123a4b567c8d901e2d3e4f56789g01h23i4j5678k90l1234m567n891o2p3q4r567s89t01u2v3w4x5678y9z0123a4b567c8d901e223a4b567c8d901e2e2";
