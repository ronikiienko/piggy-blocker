import Dexie from 'dexie';
import {BLOCKED_VIDEOS_DB_KEYS, BLOCKED_VIDEOS_DB_NAME} from '../common/consts';


export const db = new Dexie('ruBlockedStats');
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    [BLOCKED_VIDEOS_DB_NAME]: '++id, reason, timeWhenBlocked',
});


export const addToStats = ({title, link, channelName, reason, reasonDetails}) => {
    console.log('add to stats', reason, reasonDetails);
    db[BLOCKED_VIDEOS_DB_NAME].add({
        [BLOCKED_VIDEOS_DB_KEYS.title]: title || null,
        [BLOCKED_VIDEOS_DB_KEYS.link]: link || null,
        [BLOCKED_VIDEOS_DB_KEYS.channelName]: channelName || null,
        [BLOCKED_VIDEOS_DB_KEYS.reason]: reason || null,
        [BLOCKED_VIDEOS_DB_KEYS.reasonDetails]: reasonDetails || null,
        [BLOCKED_VIDEOS_DB_KEYS.timeWhenBlocked]: Date.now(),
    });
};

/**
 *
 * @param {string} [reason] Get blocked videos only for specified block reason
 */

export const getStats = (reason) => {
    if (!reason) {
        return db[BLOCKED_VIDEOS_DB_NAME].toArray();
    } else {
        return db[BLOCKED_VIDEOS_DB_NAME].where(BLOCKED_VIDEOS_DB_KEYS.reason).equals(reason).toArray();
    }
};