import {
    ALARM_SEND_TO_BACKEND,
    CMD_ADD_TO_NOT_RU_LIST,
    CMD_ADD_TO_RU_LIST,
    CMD_TAB_UPDATE,
    NOT_RU_LIST_DB_NAME,
    RU_LIST_DB_NAME,
    UID_STORAGE_KEY,
    VIDEOS_DB_KEYS,
} from '../common/consts';
import {generateId} from '../common/utils';
import {addToNotRuList, addToRuList, db} from '../commonBackground/db';


chrome.runtime.onMessage.addListener((message) => {
    switch (message.cmd) {
        case CMD_ADD_TO_RU_LIST:
            addToRuList(message?.data);
            break;
        case CMD_ADD_TO_NOT_RU_LIST:
            addToNotRuList(message?.data);
            break;
    }
});

// tabs.onUpdated not work because YouTube is SPA,
// different content scripts for different urls for same reason (need to update page to change script)
// popstate in content script not fires
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    // console.log('fskadjfkasldjfkasjdfkasjdkfjsdaf');
    if (!details.url.startsWith('https://www.youtube.com/')) return;
    chrome.tabs.sendMessage(details.tabId, {details, cmd: CMD_TAB_UPDATE})
        .catch(e => console.log(e));
});
const sendStatsToBackend = (videosArray, ru) => {
    return fetch(`http://localhost:5000/${ru ? 'addruvideos' : 'addnotruvideos'}`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                videos: videosArray,
            }),
        })
        .then((res) => {
            console.log(res);
        });
};
const prepareStatsForBackend = async (videosArray) => {
    // console.log('array to prepare....', videosArray)
    let storage = await chrome.storage.local.get({[UID_STORAGE_KEY]: null});
    for (let i = 0; i < videosArray.length; i++) {
        videosArray[i].uid = storage.uid;
        delete videosArray?.[i]?.[VIDEOS_DB_KEYS.synced];
        delete videosArray?.[i]?.[VIDEOS_DB_KEYS.ytId];
    }
    return videosArray;
};
const prepareAndSendStatsToBackend = async () => {
    const ruVideos = await db[RU_LIST_DB_NAME].where(VIDEOS_DB_KEYS.synced).equals(0);
    const notRuVideos = await db[NOT_RU_LIST_DB_NAME].where(VIDEOS_DB_KEYS.synced).equals(0);
    // console.log('not synced array...', await ruVideos.toArray());
    const ruVideosArray = await prepareStatsForBackend(await ruVideos.toArray());
    const notRuVideosArray = await prepareStatsForBackend(await notRuVideos.toArray());
    // console.log('prepared array...', ruVideosArray);

    if (ruVideosArray.length) {
        await sendStatsToBackend(ruVideosArray, true);
        await ruVideos.modify({[VIDEOS_DB_KEYS.synced]: 1});
    }

    if (notRuVideosArray.length) {
        await sendStatsToBackend(notRuVideosArray, false);
        await notRuVideos.modify({[VIDEOS_DB_KEYS.synced]: 1});
    }
};

chrome.runtime.onInstalled.addListener(async () => {
    try {
        const storage = await chrome.storage.local.get({[UID_STORAGE_KEY]: null});
        if (!storage[UID_STORAGE_KEY]) await chrome.storage.local.set({[UID_STORAGE_KEY]: generateId()});
    } catch (error) {
        console.log(`Error with ${UID_STORAGE_KEY}`, error);
    }
});

chrome.alarms.create(ALARM_SEND_TO_BACKEND.name, ALARM_SEND_TO_BACKEND.alarmCreateInfo);
chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
        case ALARM_SEND_TO_BACKEND.name:
            prepareAndSendStatsToBackend()
                .catch((e) => console.log('could not send :/', e));
    }
});




