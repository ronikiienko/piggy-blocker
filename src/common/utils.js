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
    console.log(dateObj.getMonth());
    return `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}, ${chrome.i18n.getMessage(`month_name_${dateObj?.getMonth()}`)} ${dateObj?.getDate()}`;
};

export const generateId = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

