export const wait = (msec) => {
    return new Promise(resolve => setTimeout(() => resolve(), msec));
};

export const countPercentage = (number, from) => {
    if (!number || !from) return 0
    return Math.round(number / from * 100)
}