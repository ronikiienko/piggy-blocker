import {monthNames} from './consts';


export const wait = (msec) => {
    return new Promise(resolve => setTimeout(() => resolve(), msec));
};

export const countPercentage = (number, from) => {
    if (!number || !from) return 0;
    return Math.round(number / from * 100);
};

export const getHoursFromDate = (date) => {
    if (!date) return false;
    let dateObj;
    try {
        dateObj = new Date(date);
    } catch (e) {
        return false;
    }
    return `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}`
}
export const getReadableDate = (date) => {
    if (!date) return false;
    let dateObj;
    try {
        dateObj = new Date(date);
    } catch (e) {
        return false;
    }

    return `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}, ${monthNames[dateObj?.getMonth()]} ${dateObj?.getDate()}`;
};

export const isToday = (dateUnix) => {
    const date = new Date(dateUnix);
    return date.toDateString() === (new Date()).toDateString();
};
