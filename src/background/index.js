import {
    ADD_VIDEOS_ROUTE_HREF,
    ALARM_SEND_TO_BACKEND,
    CHECKED_VIDEOS_DB_KEYS,
    CHECKED_VIDEOS_DB_NAME,
    CMD_ADD_TO_CHECKED_VIDEOS_DB,
    CMD_TAB_UPDATE,
    UID_STORAGE_KEY,
} from '../common/consts';
import {generateId} from '../common/utils';
import {addToCheckedVideosDb, db} from '../commonBackground/db';


chrome.runtime.onMessage.addListener((message) => {
    switch (message.cmd) {
        case CMD_ADD_TO_CHECKED_VIDEOS_DB:
            addToCheckedVideosDb(message?.data)
                .catch(console.log);
            break;
    }
});

// tabs.onUpdated not work because YouTube is SPA,
// different content scripts for different urls for same reason (need to update page to change script)
// popstate in content script not fires
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    if (!details.url.startsWith('https://www.youtube.com/')) return;
    chrome.tabs.sendMessage(details.tabId, {details, cmd: CMD_TAB_UPDATE})
        .catch(e => console.log(e));
});
const sendStatsToBackend = (videosArray) => {
    return fetch(ADD_VIDEOS_ROUTE_HREF,
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
    // .then((res) => {
    //     console.log(res);
    // });
};

const prepareStats = async (videosArray) => {
    let storage = await chrome.storage.local.get({[UID_STORAGE_KEY]: null});

    const videosToBackand = [];
    const videosToUpdate = [];

    videosArray.forEach(video => {
        const videoForBackand = {
            ...video,
            uid: storage.uid,
        };
        delete videoForBackand[CHECKED_VIDEOS_DB_KEYS.synced];
        delete videoForBackand[CHECKED_VIDEOS_DB_KEYS.ytId];
        videosToBackand.push(videoForBackand);

        videosToUpdate.push({
            ...video,
            [CHECKED_VIDEOS_DB_KEYS.synced]: 1,
        });
    });

    return {videosToBackand, videosToUpdate};
};

const prepareAndSendStatsToBackend = async () => {
    // console.log('NOT SYNCED', await db[CHECKED_VIDEOS_DB_NAME].where(CHECKED_VIDEOS_DB_KEYS.synced).equals(0).toArray());
    // console.log('SYNCED', await db[CHECKED_VIDEOS_DB_NAME].where(CHECKED_VIDEOS_DB_KEYS.synced).equals(1).toArray());
    // console.log('ALL', await db[CHECKED_VIDEOS_DB_NAME].toArray());

    const {
        videosToUpdate,
        videosToBackand,
    } = await prepareStats(await db[CHECKED_VIDEOS_DB_NAME].where(CHECKED_VIDEOS_DB_KEYS.synced).equals(0).toArray());
    if (videosToUpdate?.[0] && videosToUpdate?.[0]) {
        const response = await sendStatsToBackend(videosToBackand);
        if (response.status === 200) await db[CHECKED_VIDEOS_DB_NAME].bulkPut(videosToUpdate);
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
// chrome.alarms.get(ALARM_SEND_TO_BACKEND.name, async (alarm) => {
//     const date = getReadableDate(alarm.scheduledTime);
//     console.log(alarm, date);
// });



