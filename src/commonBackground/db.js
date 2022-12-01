import Dexie from 'dexie';
import {NOT_RU_LIST_DB_NAME, RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../common/consts';


export const db = new Dexie('ruBlockedStats');
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    [RU_LIST_DB_NAME]: `&${VIDEOS_DB_KEYS.ytId}, ${VIDEOS_DB_KEYS.reason}, ${VIDEOS_DB_KEYS.timeWhenBlocked}`,
    [NOT_RU_LIST_DB_NAME]: `&${VIDEOS_DB_KEYS.ytId}, ${VIDEOS_DB_KEYS.reason}, ${VIDEOS_DB_KEYS.timeWhenBlocked}`,
});


export const addToRuList = (data) => {
    db[RU_LIST_DB_NAME].put(data);
};

export const addToNotRuList = (data) => {
    db[NOT_RU_LIST_DB_NAME].put(data)
}

