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
//  * Checks video title and description for ru
//  * @param {{title: string, description: (string|undefined)}} videoData
//  * @returns {Promise<boolean>}
//  */
// export const checkIsVideoDataRu = async (videoData) => {
//     if (!videoData?.title) return false
//
//     let isStringRu;
//
//     isStringRu = checkStringForRuChars(videoData.title)
//     if (isStringRu !== null) return isStringRu
//
//     if (videoData?.description) {
//         isStringRu = checkStringForRuChars(videoData.description)
//         if (isStringRu !== null) return isStringRu
//     }
//
//     const concatenatedString = videoData?.description ? videoData.title + ' ' + videoData.description : videoData.title
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

const stats = {
    byChars: 0,
    noCyrillic: 0,
    markerWords: 0,
    google: 0
}
const checkStringForRuChars = (stringToCheck) => {
    if (ruCharsPattern.test(stringToCheck)) return true;
    if (ukrCharsPattern.test(stringToCheck)) return false;
    return null

};
const checkStringForCyrillic = (stringToCheck) => {
    if (!cyrillicPattern.test(stringToCheck)) return false;
    return null

}
const checkStringForMarkerWords = (stringToCheck) => {
    const words = stringToCheck.split(' ')
    let foundMarker = false;
    for (let word of words) {
        if (markers.has(word)) {
            // console.error('FOUND', stringToCheck,'7777777777777', word);
            foundMarker = true
            break;
        }
    }
    return foundMarker ? true : null

}
const checkStringForRuGoogle = async (stringToCheck) => {
    const uriEncodedString = encodeURIComponent(stringToCheck);
    const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
    const googleRespJson = await googleResp.json();
    // console.error('GOGLA', stringToCheck, googleRespJson.src);
    return googleRespJson.src === 'ru';

};
setTimeout(() => {
    console.log(stats);
}, 60 * 1000)

export const checkIsVideoDataRu = async (videoData) => {
    if (!videoData?.title) return false
    let isStringRu;
    isStringRu = checkStringForRuChars(videoData.title)
    // console.log('ru chars check title:', videoData.title, isStringRu);
    if (isStringRu !== null) {
        stats.byChars = stats.byChars + 1
        return isStringRu;
    }
    if (videoData?.description) {
        isStringRu = checkStringForRuChars(videoData.description)
        // console.log('ru chars check description:', videoData.description, isStringRu);
        if (isStringRu !== null) {
            stats.byChars = stats.byChars + 1
            return isStringRu;
        }
    }
    const concatenatedString = videoData?.description ? videoData.title + ' ' + videoData.description : videoData.title
    isStringRu = checkStringForCyrillic(concatenatedString)
    // console.log('cyrrilic check:', videoData.title, isStringRu);
    if (isStringRu !== null) {
        stats.noCyrillic = stats.noCyrillic + 1
        return isStringRu;
    }
    isStringRu = checkStringForMarkerWords(concatenatedString)
    // console.log('marker check:',concatenatedString, isStringRu);
    if (isStringRu !== null) {
        stats.markerWords = stats.markerWords + 1
        return isStringRu;
    }
    try {
        const googleCheckResult = await checkStringForRuGoogle(concatenatedString)
        stats.google = stats.google + 1
        return googleCheckResult
    } catch (e) {
        console.log(e.message);
        return false
    }
};

