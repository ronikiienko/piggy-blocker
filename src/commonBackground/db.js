import Dexie from 'dexie';
import {CHECKED_VIDEOS_DB_KEYS, CHECKED_VIDEOS_DB_NAME} from '../common/consts';


export const db = new Dexie('ruBlockedStats');
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    [CHECKED_VIDEOS_DB_NAME]: `&${CHECKED_VIDEOS_DB_KEYS.ytId}, ${CHECKED_VIDEOS_DB_KEYS.isRu}, ${CHECKED_VIDEOS_DB_KEYS.reason}, ${CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked}, ${CHECKED_VIDEOS_DB_KEYS.synced}`,
});

export const addToCheckedVideosDb = (data) => {
    db[CHECKED_VIDEOS_DB_NAME].put({
        ...data,
        [CHECKED_VIDEOS_DB_KEYS.synced]: 0,
    });
};

export const clearDb = () => {
    db[CHECKED_VIDEOS_DB_NAME].clear();
};

