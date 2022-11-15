const ruCharsPattern = /ё|э|ии|ы|ъ|ее|шь/i;
const ukrCharsPattern = /[іїє]/i;
const cyrillicPattern = /[\u0400-\u04FF]+/i;
const markers = new Set(['больше', 'будет', 'будут', 'во', 'вообще', 'вот', 'время', 'всего', 'всем', 'всех', 'где', 'его', 'если', 'есть', 'еще', 'и', 'из', 'или', 'им', 'именно', 'интересно', 'их', 'к', 'как', 'какие', 'какой', 'когда', 'конечно', 'кто', 'лет', 'ли', 'либо', 'лучше', 'меня', 'мне', 'много', 'может', 'можно', 'надо', 'налоги', 'например', 'нет', 'ни', 'но', 'нужно', 'они', 'отвечаю', 'очень', 'под', 'после', 'почему', 'работать', 'с', 'сейчас', 'со', 'стоит', 'такое', 'такой', 'теперь', 'только', 'украине', 'чем', 'что']);
const ruWordsPattern = /\sи\s/i;

// /**
//  * Check if contains special ru or ukr chars
//  * @param {string} stringToCheck
//  * @returns {boolean|null} - returns null if nothing specific found
//  */
// const checkStringForRuChars = (stringToCheck) => {
//     if (ruCharsPattern.test(stringToCheck)) return true;
//     if (ukrCharsPattern.test(stringToCheck)) return false;
//     return null
// };
//
//
// /**
//  * Check if contains cyrillic at all
//  * @param {string} stringToCheck
//  * @returns {null|boolean} - returns null if nothing specific found
//  */
// const checkStringForCyrillic = (stringToCheck) => {
//     if (!cyrillicPattern.test(stringToCheck)) return false;
//     return null
// }
//
// const checkStringForMarkerWords = (stringToCheck) => {
//     const words = stringToCheck.split(' ')
//     let foundMarker = false;
//     for (let word of words) {
//         if (markers.has(word)) {
//             foundMarker = true
//             break;
//         }
//     }
//     return foundMarker ? true : null
// }
//
// /**
//  * If basic check couldn't find anything, use Google Translate
//  * @param {string} stringToCheck
//  * @returns {Promise<boolean>}
//  */
// const checkStringForRuGoogle = async (stringToCheck) => {
//     const uriEncodedString = encodeURIComponent(stringToCheck);
//     const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
//     const googleRespJson = await googleResp.json();
//     return googleRespJson.src === 'ru';
// };
//
// /**
//  *
//  * @param title {string}
//  * @param [channelName] {string}
//  * @param [description] {string}
//  * @returns {Promise<boolean>}
//  */
// export const checkIsVideoDataRu = async (title, channelName, description) => {
//     if (!title) return false
//
//     let isStringRu;
//
//     isStringRu = checkStringForRuChars(title)
//     if (isStringRu !== null) return isStringRu
//
//     if (description) {
//         isStringRu = checkStringForRuChars(description)
//         if (isStringRu !== null) return isStringRu
//     }
//
//     const concatenatedString = description ? title + ' ' + description : title
//
//     isStringRu = checkStringForCyrillic(concatenatedString)
//     if (isStringRu !== null) return isStringRu
//
//     isStringRu = checkStringForMarkerWords(concatenatedString)
//     if (isStringRu !== null) return isStringRu
//
//     try {
//         return await checkStringForRuGoogle(concatenatedString)
//     } catch (e) {
//         console.log(e.message);
//         return false
//     }
// };

// --------------------------------------------------


const checkStringForRuChars = (stringToCheck) => {
    if (ruCharsPattern.test(stringToCheck)) return true;
    if (ukrCharsPattern.test(stringToCheck)) return false;
    return null;

};
const checkStringForCyrillic = (stringToCheck) => {
    if (!cyrillicPattern.test(stringToCheck)) return false;
    return null;

};
const checkStringForMarkerWords = (stringToCheck) => {
    const words = stringToCheck.split(' ');
    let foundMarker = false;
    for (let word of words) {
        if (markers.has(word)) {
            // console.error('FOUND', stringToCheck,'7777777777777', word);
            foundMarker = true;
            break;
        }
    }
    return foundMarker ? true : null;

};
const checkStringForRuGoogle = async (stringToCheck) => {
    const uriEncodedString = encodeURIComponent(stringToCheck);
    const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
    const googleRespJson = await googleResp.json();
    // console.error('GOGLA', stringToCheck, googleRespJson.src);
    return googleRespJson.src === 'ru';

};
setTimeout(() => {
    for (let key in stats.percentages) {
        let numberOfPercent
        if (!stats[key].number) {
            numberOfPercent = 0
        } else {
            numberOfPercent = ((stats[key].number / stats.total.total) * 100).toFixed(1)
        }
        stats.percentages[key] = numberOfPercent + '%'
    }
    console.log(stats);
}, 20 * 1000);

const stats = {
    total: {
        total: 0,
        russian: 0,
        notRussian: 0
    },
    byCharsTitle: {
        number: 0,
        texts: []
    },
    byCharsChannelName: {
        number: 0,
        texts: []
    },
    byCharsDescription: {
        number: 0,
        texts: []
    },
    noCyrillic: {
        number: 0,
        texts: []
    },
    markerWords: {
        number: 0,
        texts: []
    },
    google: {
        number: 0,
        texts: []
    },
    percentages: {
        byCharsTitle: 0,
        byCharsChannelName: 0,
        byCharsDescription: 0,
        noCyrillic: 0,
        markerWords: 0,
        google: 0,
    }
};

/**
 *
 * @param title
 * @param [channelName]
 * @param [description]
 * @returns {Promise<boolean>}
 */
export const checkIsVideoDataRu = async (title, channelName, description) => {
    stats.total.total = stats.total.total + 1
    if (!title) return false;
    let isStringRu;

    isStringRu = checkStringForRuChars(title);
    // console.log('ru chars check title:', title, isStringRu);
    if (isStringRu !== null) {
        stats.byCharsTitle.number = stats.byCharsTitle.number + 1;
        stats.byCharsTitle.texts.push({
            title: title,
            channelName: channelName,
            description: description
        })
        if (isStringRu) {
            stats.total.russian = stats.total.russian + 1;
        } else {
            stats.total.notRussian = stats.total.notRussian +1
        }
        return isStringRu;
    }

    if (description) {
        isStringRu = checkStringForRuChars(description);
        // console.log('ru chars check description:', description, isStringRu);
        if (isStringRu !== null) {
            stats.byCharsDescription.number = stats.byCharsDescription.number + 1;
            stats.byCharsDescription.texts.push({
                title: title,
                channelName: channelName,
                description: description
            })
            if (isStringRu) {
                stats.total.russian = stats.total.russian + 1;
            } else {
                stats.total.notRussian = stats.total.notRussian + 1
            }
            return isStringRu;
        }
    }

    if (channelName) {
        isStringRu = checkStringForRuChars(channelName);
        if (isStringRu !== null) {
            stats.byCharsChannelName.number = stats.byCharsChannelName.number + 1;
            stats.byCharsChannelName.texts.push({
                title: title,
                channelName: channelName,
                description: description
            })
            if (isStringRu) {
                stats.total.russian = stats.total.russian +1 ;
            } else {
                stats.total.notRussian = stats.total.notRussian + 1
            }
            return isStringRu
        }
    }

    const concatenatedString = description ? title + ' ' + description : title;

    isStringRu = checkStringForCyrillic(concatenatedString);
    // console.log('cyrrilic check:', title, isStringRu);
    if (isStringRu !== null) {
        stats.noCyrillic.number = stats.noCyrillic.number + 1;
        stats.noCyrillic.texts.push({
            title: title,
            channelName: channelName,
            description: description
        })
        if (isStringRu) {
            stats.total.russian = stats.total.russian + 1;
        } else {
            stats.total.notRussian = stats.total.notRussian+ 1
        }
        return isStringRu;
    }

    isStringRu = checkStringForMarkerWords(concatenatedString);
    // console.log('marker word check:',concatenatedString, isStringRu);
    if (isStringRu !== null) {
        stats.markerWords.number = stats.markerWords.number + 1;
        stats.markerWords.texts.push({
            title: title,
            channelName: channelName,
            description: description
        })
        if (isStringRu) {
            stats.total.russian = stats.total.russian + 1;
        } else {
            stats.total.notRussian = stats.total.notRussian + 1
        }
        return isStringRu;
    }

    try {
        const googleCheckResult = await checkStringForRuGoogle(concatenatedString);
        stats.google.number = stats.google.number + 1;
        stats.google.texts.push({
            title: title,
            channelName: channelName,
            description: description
        })
        if (googleCheckResult) {
            stats.total.russian = stats.total.russian + 1;
        } else {
            stats.total.notRussian = stats.total.notRussian + 1
        }
        return googleCheckResult;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

