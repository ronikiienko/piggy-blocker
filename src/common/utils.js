export const wait = (msec) => {
    return new Promise(resolve => setTimeout(() => resolve(), msec));
};

export const countPercentage = (number, from) => {
    return Math.round(number / from * 100)
}