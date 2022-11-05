const ruCharsPattern = /ё|э|ии|ы|ъ/i;
const ukrCharsPattern = /[іїє]/i;
const cyrillicPattern = /[\u0400-\u04FF]+/i;
const ruWordsPattern = /\sи\s/i;

/**
 * Check if contains special ru or ukr chars
 * @param {string} stringToCheck
 * @returns {boolean|null} - returns null if nothing specific found
 */
const checkStringForRuChars = (stringToCheck) => {
    if (ruCharsPattern.test(stringToCheck)) return true;
    if (ukrCharsPattern.test(stringToCheck)) return false;
    return null
};


/**
 * Check if contains cyrillic at all
 * @param {string} stringToCheck
 * @returns {null|boolean} - returns null if nothing specific found
 */
const checkStringForCyrillic = (stringToCheck) => {
    if (!cyrillicPattern.test(stringToCheck)) return false;
    return null
}

/**
 * If basic check couldn't find anything, use Google Translate
 * @param {string} stringToCheck
 * @returns {Promise<boolean>}
 */
const checkStringForRuGoogle = async (stringToCheck) => {
    const uriEncodedString = encodeURIComponent(stringToCheck);
    const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
    const googleRespJson = await googleResp.json();
    return googleRespJson.src === 'ru';
};

/**
 * Checks video title and description for ru
 * @param {{title: string, description: string}} videoData
 * @returns {Promise<boolean>}
 */
export const checkIsVideoDataRu = async (videoData) => {
    if (!videoData?.title) return false
    let isStringRu;
    isStringRu = checkStringForRuChars(videoData.title)
    if (isStringRu !== null) return isStringRu
    if (!videoData?.description) {
        isStringRu = checkStringForRuChars(videoData.description)
        if (isStringRu !== null) return isStringRu
    }
    const concatenatedString = videoData?.description ? videoData.title : videoData.title + ' ' + videoData.description
    isStringRu = checkStringForCyrillic(concatenatedString)
    if (isStringRu !== null) return isStringRu
    try {
        return await checkStringForRuGoogle(concatenatedString)
    } catch (e) {
        console.log(e.message);
        return false
    }
};
// export const checkIsVideoDataRu = async (videoData) => {
//     if (!videoData?.title) return false
//     let isStringRu;
//     isStringRu = checkStringForRuChars(videoData.title)
//     console.log('ru chars check:', videoData.title, isStringRu);
//     if (isStringRu !== null) {
//         return isStringRu;
//     }
//     isStringRu = checkStringForCyrillic(videoData.title)
//     console.log('cyrrilic check:', isStringRu);
//     if (isStringRu !== null) {
//         return isStringRu;
//     }
//     try {
//         console.warn('GOOGLE CHECK');
//         return await checkStringForRuGoogle(videoData.title)
//     } catch (e) {
//         console.log(e.message);
//         return false
//     }
// };

