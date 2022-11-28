import Dexie from 'dexie';
import {
    BLOCKED_VIDEOS_DB_KEYS,
    BLOCKED_VIDEOS_DB_NAME, LIST_DB_KEYS,
    NOT_RU_LIST_DB_NAME,
    RU_LIST_DB_NAME,
} from '../common/consts';


export const db = new Dexie('ruBlockedStats');
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    [BLOCKED_VIDEOS_DB_NAME]: '++id, reason, timeWhenBlocked',
    [NOT_RU_LIST_DB_NAME]: '++id, youtubeId',
    [RU_LIST_DB_NAME]: '++id, youtubeId'
});


export const addToStats = (data) => {
    db[BLOCKED_VIDEOS_DB_NAME].put(data);
};

export const addToRuList = (id) => {
    db[RU_LIST_DB_NAME].put({
        [LIST_DB_KEYS.youtubeId]: id
    })
}
export const addToNotRuList = (id) => {
    db[NOT_RU_LIST_DB_NAME].put({
        [LIST_DB_KEYS.youtubeId]: id
    })
}

