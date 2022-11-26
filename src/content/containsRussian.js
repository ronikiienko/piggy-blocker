import {BLOCK_REASONS} from '../common/consts';


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
    const returnBoolean = foundMarker ? true : null;
    return {
        isRu: returnBoolean,
        wordFound,
    };

};
const checkStringForRuGoogle = async (stringToCheck) => {
    const uriEncodedString = encodeURIComponent(stringToCheck);
    const googleResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uk&hl=en-US&dt=t&dt=bd&dj=1&source=input&tk=466611.466611&q=${uriEncodedString}`);
    const googleRespJson = await googleResp.json();
    // console.error('GOGLA', stringToCheck, googleRespJson.src);
    const returnBoolean = googleRespJson?.src === 'ru';
    return {
        isRu: returnBoolean,
        langFound: googleRespJson.src,
    };

};


/**
 *
 * @param title
 * @param channelName
 * @returns {Promise<{reason: string, isRu: boolean, reasonDetails}|boolean|{reason: string, isRu: boolean, reasonDetails: null}>}
 */

export const checkIsVideoDataRu = async (title, channelName) => {
    if (!title) return false;
    let isRu;

    isRu = checkStringForRuChars(title);
    // console.log('ru chars check title:', title, isRu);
    if (isRu !== null) {
        return {
            isRu,
            reason: BLOCK_REASONS.byCharsTitle,
            reasonDetails: null,
        };
    }
    // TODO maby not handle 'MIX' items
    if (channelName) {
        isRu = checkStringForRuChars(channelName, false);
        if (isRu !== null) {
            return {
                isRu,
                reason: BLOCK_REASONS.byCharsChannelName,
                reasonDetails: null,
            };
        }
    }

    isRu = checkStringForCyrillic(title);
    if (isRu !== null) {
        return {
            isRu,
            reason: BLOCK_REASONS.noCyrillic,
            reasonDetails: null,
        };
    }


    const markerCheckResult = checkStringForMarkerWords(title);
    isRu = markerCheckResult.isRu;
    // console.log('marker word check:',concatenatedString, isRu);
    if (isRu !== null) {
        return {
            isRu,
            reason: BLOCK_REASONS.markerWords,
            reasonDetails: markerCheckResult.wordFound,
        };
    }

    try {
        const googleCheckResult = await checkStringForRuGoogle(title);
        isRu = googleCheckResult.isRu;
        return {
            isRu,
            reason: BLOCK_REASONS.google,
            reasonDetails: googleCheckResult.langFound,
        };
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

