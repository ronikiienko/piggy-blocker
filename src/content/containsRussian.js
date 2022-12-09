import {BLOCK_REASONS_MAP} from '../common/consts';
import {cyrillicPattern, ruCharsPattern, ruWords, ukrCharsPattern, ukrWords} from './containsRussianConsts';
import {isRuStore} from './videoStore';
const checkStringForRuChars = (stringToCheck, searchForUkr = true) => {
    if (ruCharsPattern.test(stringToCheck)) return true;
    if (searchForUkr) {
        if (ukrCharsPattern.test(stringToCheck)) return false;
    }
    return null;
};

const checkSessionStore = (id) => {
    if (!id) return false
    const storeCheck = isRuStore.check(id);
    if (storeCheck === null) return null
    return storeCheck;
}
const checkStringForCyrillic = (stringToCheck) => {
    if (!cyrillicPattern.test(stringToCheck)) return false;
    return null;

};
const checkStringForMarkerWords = (stringToCheck) => {
    const words = stringToCheck.split(' ');
    let foundMarker = null;
    let wordFound;
    for (let word of words) {
        word = word.toLowerCase().replace(/[.,()!:"']/g, '')
        if (ruWords.has(word)) {
            // console.error('FOUND', stringToCheck,'7777777777777', word);
            foundMarker = true;
            wordFound = word;
            break;
        }
        if (ukrWords.has(word)) {
            // console.error('FOUND', stringToCheck,'7777777777777', word);
            foundMarker = true;
            wordFound = word;
            break;
        }
    }
    return {
        isRu: foundMarker,
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

// TODO add check by indexedDB local db
/**
 *
 * @param title
 * @param [channelName] {string}
 * @returns {Promise<{reason: string, isRu: boolean, reasonDetails}|boolean|{reason: string, isRu: boolean, reasonDetails: null}>}
 */

export const checkIsVideoDataRu = async (title, channelName, id) => {
    if (!title) return false;
    let isRu;

    isRu = checkSessionStore(id)
    if (isRu !== null) {
        // console.log('in sess storage...');
        return {
            isRu,
            reason: BLOCK_REASONS_MAP.inSessStorage,
            reasonDetails: null
        }
    }

    isRu = checkStringForRuChars(title);
    // console.log('ru chars check title:', title, isRu);
    if (isRu !== null) {
        isRuStore.addVideo(id, isRu);
        return {
            isRu,
            reason: BLOCK_REASONS_MAP.byCharsTitle,
            reasonDetails: null,
        };
    }


    if (channelName) {
        isRu = checkStringForRuChars(channelName, false);
        if (isRu !== null) {
            isRuStore.addVideo(id, isRu);
            return {
                isRu,
                reason: BLOCK_REASONS_MAP.byCharsChannelName,
                reasonDetails: null,
            };
        }
    }


    isRu = checkStringForCyrillic(title);
    if (isRu !== null) {
        isRuStore.addVideo(id, isRu);
        return {
            isRu,
            reason: BLOCK_REASONS_MAP.noCyrillic,
            reasonDetails: null,
        };
    }


    const markerCheckResult = checkStringForMarkerWords(title);
    isRu = markerCheckResult.isRu;
    // console.log('marker word check:',concatenatedString, isRu);
    if (isRu !== null) {
        isRuStore.addVideo(id, isRu);
        return {
            isRu,
            reason: BLOCK_REASONS_MAP.markerWords,
            reasonDetails: markerCheckResult.wordFound,
        };
    }

    try {
        const googleCheckResult = await checkStringForRuGoogle(title);
        isRu = googleCheckResult.isRu;
        isRuStore.addVideo(id, isRu);
        return {
            isRu,
            reason: BLOCK_REASONS_MAP.google,
            reasonDetails: googleCheckResult.langFound,
        };
    } catch (e) {
        console.log(e.message, 'mimim');
        return false;
    }
};

