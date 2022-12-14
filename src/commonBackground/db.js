import Dexie from 'dexie';
import {NOT_RU_LIST_DB_NAME, RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../common/consts';


export const db = new Dexie('ruBlockedStats');
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    [RU_LIST_DB_NAME]: `&${VIDEOS_DB_KEYS.ytId}, ${VIDEOS_DB_KEYS.reason}, ${VIDEOS_DB_KEYS.timeWhenBlocked}, ${VIDEOS_DB_KEYS.synced}`,
    [NOT_RU_LIST_DB_NAME]: `&${VIDEOS_DB_KEYS.ytId}, ${VIDEOS_DB_KEYS.reason}, ${VIDEOS_DB_KEYS.timeWhenBlocked}, ${VIDEOS_DB_KEYS.synced}`,
});


export const addToRuList = (data) => {
    db[RU_LIST_DB_NAME].put({
        ...data,
        [VIDEOS_DB_KEYS.synced]: 0,
    });
};

export const addToNotRuList = (data) => {
    db[NOT_RU_LIST_DB_NAME].put({
        ...data,
        [VIDEOS_DB_KEYS.synced]: 0,
    });
}

export const clearDb = () => {
    db[RU_LIST_DB_NAME].clear()
    db[NOT_RU_LIST_DB_NAME].clear()
}

