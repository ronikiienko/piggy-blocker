import {useLiveQuery} from 'dexie-react-hooks';
import {
    BLOCK_REASONS_MAP, BLOCKED_VIDEOS_DB_KEYS,
    CMD_ADD_TO_BLOCKED_STATS,
    CMD_ADD_TO_NOT_RU_LIST,
    CMD_ADD_TO_RU_LIST,
} from '../common/consts';


setTimeout(() => {
    stats.total.total = stats.total.russian.number + stats.total.notRussian.number;
    for (let key in stats.percentages) {
        let numberOfPercent
        if (!stats[key].number) {
            numberOfPercent = 0
        } else {
            numberOfPercent = ((stats[key].number / stats.total.total) * 100).toFixed(1)
        }
        stats.percentages[key] = numberOfPercent + '%'
    }
    console.log(stats);
}, 20 * 1000);

const stats = {
    total: {
        total: 0,
        russian: {
            number: 0,
            texts: []
        },
        notRussian: {
            number: 0,
            texts: []
        }
    },
    byCharsTitle: {
        number: 0,
        texts: []
    },
    byCharsChannelName: {
        number: 0,
        texts: []
    },
    byCharsDescription: {
        number: 0,
        texts: []
    },
    noCyrillic: {
        number: 0,
        texts: []
    },
    markerWords: {
        number: 0,
        texts: []
    },
    google: {
        number: 0,
        texts: []
    },
    percentages: {
        byCharsTitle: 0,
        byCharsChannelName: 0,
        byCharsDescription: 0,
        noCyrillic: 0,
        markerWords: 0,
        google: 0,
    }
};


export const addToDb = (data, isRu) => {
    if (isRu) {
        chrome.runtime.sendMessage({
            cmd: CMD_ADD_TO_BLOCKED_STATS,
            data
        })
            .catch(console.log)
        chrome.runtime.sendMessage({
            cmd: CMD_ADD_TO_RU_LIST,
            id: data[BLOCKED_VIDEOS_DB_KEYS.link]
        })
            .catch(console.log)
    } else {
        chrome.runtime.sendMessage({
            cmd: CMD_ADD_TO_NOT_RU_LIST,
            id: data[BLOCKED_VIDEOS_DB_KEYS.link]
        })
            .catch(console.log)
    }
    // console.log(reason, ':', '\n',
    //     'title: ',allDataObject.title, '\n',
    //     'channelName: ', allDataObject.channelName, '\n',
    //     'description: ',  allDataObject.description, '\n',
    //     'checkResult: ', ru, '\n',
    //     'details: ', reasonDetails
    // );
    // if (ru === null) return
    // if (ru) {
    //     stats.total.russian.number = stats.total.russian.number + 1
    //     stats.total.russian.texts.push({
    //         title,
    //         channelName,
    //         reason: reason,
    //         reasonDetails
    //     })
    // } else {
    //     stats.total.notRussian.number = stats.total.notRussian.number + 1
    //     stats.total.notRussian.texts.push({
    //         title,
    //         channelName,
    //         reason: reason,
    //         reasonDetails
    //     })
    // }
    // stats[reason].number = stats[reason].number + 1
    // stats[reason].texts.push({
    //     title,
    //     channelName,
    //     reasonDetails,
    //     isRu: ru
    // })
}