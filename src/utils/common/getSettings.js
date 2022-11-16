import {DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY} from '../../common/consts';


export const getSettings = async () => {
    try {
        const storage = await chrome.storage.sync.get({[SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS});
        return storage[SETTINGS_STORAGE_KEY];
    } catch (e) {
        console.log(e);
    }
};