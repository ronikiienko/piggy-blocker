const ruCharsPattern = /ё|э|ии|ы|ъ|ее|шь/i;
const ukrCharsPattern = /[іїє]/i;
const cyrillicPattern = /[\u0400-\u04FF]+/i;
const markers = new Set(['больше', 'будет', 'будут', 'во', 'вообще', 'вот', 'время', 'всего', 'всем', 'всех', 'где', 'его', 'если', 'есть', 'еще', 'и', 'из', 'или', 'им', 'именно', 'интересно', 'их', 'к', 'как', 'какие', 'какой', 'когда', 'конечно', 'кто', 'лет', 'ли', 'либо', 'лучше', 'меня', 'мне', 'много', 'может', 'можно', 'надо', 'налоги', 'например', 'нет', 'ни', 'но', 'нужно', 'они', 'отвечаю', 'очень', 'под', 'после', 'почему', 'работать', 'с', 'сейчас', 'со', 'стоит', 'такое', 'такой', 'теперь', 'только', 'украине', 'чем', 'что']);
const ruWordsPattern = /\sи\s/i;

const checkStringForRuChars = (stringToCheck, searchForUkr = true) => {
    if (ruCharsPattern.test(stringToCheck)) return true;
    if (searchForUkr) {
        if (ukrCharsPattern.test(stringToCheck)) return false;
    }
    return null;

};
const checkStringForCyrillic = (stringToCheck) => {
    if (!cyrillicPattern.test(stringToCheck)) return false;
    return null;

};
const checkStringForMarkerWords = (stringToCheck) => {
    const words = stringToCheck.split(' ');
    let foundMarker = false;
    let wordFound;
    for (let word of words) {
        if (markers.has(word)) {
            // console.error('FOUND', stringToCheck,'7777777777777', word);
            foundMarker = true;
            wordFound = word;
            break;
        }
    }
    const returnBoolean = foundMarker ? true : null
    return {
        isStringRu: returnBoolean,
        wordFound
    }

};
const checkStringForRuGoogle = async (stringToCheck) => {
    const uriEncodedString = encodeURIComponent(stringToCheck);
    const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
    const googleRespJson = await googleResp.json();
    // console.error('GOGLA', stringToCheck, googleRespJson.src);
    const returnBoolean = googleRespJson.src === 'ru'
    return {
        isStringRu: returnBoolean,
        langFound: googleRespJson.src
    };

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
        russian: {
            number: 0,
            texts: []
        },
        notRussian: {
            number: 0,
            texts: []
        }
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
 * @param allDataObject
 * @param ru
 * @param {('byCharsTitle')|('byCharsChannelName')|('byCharsDescription')|('noCyrillic')|('markerWords')|('google')} reasonName
 * @param reasonDetails
 */
const addToStats = (allDataObject = {}, ru, reasonName, reasonDetails) => {
    console.log(reasonName, ':', '\n',
        'title: ',allDataObject.title, '\n',
        'channelName: ', allDataObject.channelName, '\n',
        'description: ',  allDataObject.description, '\n',
        'checkResult: ', ru, '\n',
        'details: ', reasonDetails
    );
    if (ru) {
        stats.total.russian.number = stats.total.russian.number + 1
        stats.total.russian.texts.push({
            ...allDataObject,
            reason: reasonName,
            reasonDetails
        })
    } else {
        stats.total.notRussian.number = stats.total.notRussian.number + 1
        stats.total.notRussian.texts.push({
            ...allDataObject,
            reason: reasonName,
            reasonDetails
        })
    }
    stats[reasonName].number = stats[reasonName].number + 1
    stats[reasonName].texts.push({
        ...allDataObject,
        reasonDetails,
        isRu: ru
    })
}

/**
 *
 * @param title
 * @param [channelName]
 * @param [description]
 * @returns {Promise<boolean>}
 */

export const checkIsVideoDataRu = async (title, channelName, description) => {
    const allDataObject = {
        title,
        channelName,
        description
    }
    stats.total.total = stats.total.total + 1
    if (!title) return false;
    let isStringRu;

    isStringRu = checkStringForRuChars(title);
    // console.log('ru chars check title:', title, isStringRu);
    if (isStringRu !== null) {
        addToStats(allDataObject, isStringRu, 'byCharsTitle', null)
        return isStringRu;
    }

    if (description) {
        isStringRu = checkStringForRuChars(description);
        addToStats(allDataObject, isStringRu, 'byCharsDescription', null)
        if (isStringRu !== null) {
            return isStringRu;
        }
    }
    // TODO not handle 'MIX' items
    if (channelName) {
        isStringRu = checkStringForRuChars(channelName, false);
        addToStats(allDataObject, isStringRu, 'byCharsChannelName', null)
        if (isStringRu !== null) {
            return isStringRu
        }
    }

    const concatenatedString = description ? title + ' ' + description : title;

    isStringRu = checkStringForCyrillic(concatenatedString);
    addToStats(allDataObject, isStringRu, 'noCyrillic', null)
    if (isStringRu !== null) {
        return isStringRu;
    }


    const markerCheckResult = checkStringForMarkerWords(concatenatedString)
    isStringRu = markerCheckResult.isStringRu;
    // console.log('marker word check:',concatenatedString, isStringRu);
    addToStats(allDataObject, isStringRu, 'markerWords', markerCheckResult.wordFound)
    if (isStringRu !== null) {
        return isStringRu;
    }

    try {
        const googleCheckResult = await checkStringForRuGoogle(concatenatedString);
        isStringRu = googleCheckResult.isStringRu;
        addToStats(allDataObject, isStringRu, 'google', googleCheckResult.langFound)
        return isStringRu;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

