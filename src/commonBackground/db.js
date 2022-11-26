import Dexie from 'dexie';

const db = new Dexie("ruBlockedStats");
// title, link, channelName, reason, reasonDetails, timeWhenBlocked
db.version(1).stores({
    blockedVideos: "++id, reason, timeWhenBlocked"
})


export const addToStats = ({title, link, channelName, reason, reasonDetails}) => {
    console.log('add to stats', reason, reasonDetails);
    db.blockedVideos.add({
        title: title || null,
        link: link || null,
        channelName: channelName || null,
        reason: reason || null,
        reasonDetails: reasonDetails || null,
        timeWhenBlocked: Date.now()
    })
}

/**
 *
 * @param {string} [reason] Get blocked videos only for specified block reason
 */

export const getStats = (reason) => {
    if (!reason) {
        return db.blockedVideos.toArray()
    } else {
        return db.where("reason").equals(reason).toArray()
    }
}