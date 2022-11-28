import {useLiveQuery} from 'dexie-react-hooks';
import {
    BLOCK_REASONS_MAP,
    BLOCKED_VIDEOS_DB_KEYS,
    BLOCKED_VIDEOS_DB_NAME,
    NOT_RU_LIST_DB_NAME,
    RU_LIST_DB_NAME,
} from '../../common/consts';
import {db} from '../db';


export const useStats = () => {
    const ruTotal = useLiveQuery(
        () => db[RU_LIST_DB_NAME].toArray()
    )
    const notRuTotal = useLiveQuery(
        () => db[NOT_RU_LIST_DB_NAME].toArray()
    )
    const byCharsTitle = useLiveQuery(
        () => db[BLOCKED_VIDEOS_DB_NAME]
            .where(BLOCKED_VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsTitle)
            .toArray()
    )
    const byCharsChannelName = useLiveQuery(() =>
        db[BLOCKED_VIDEOS_DB_NAME]
            .where(BLOCKED_VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsChannelName)
            .toArray()
    )
    const markerWords = useLiveQuery(() =>
        db[BLOCKED_VIDEOS_DB_NAME]
            .where(BLOCKED_VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.markerWords)
            .toArray()
    )
    const google = useLiveQuery(() =>
        db[BLOCKED_VIDEOS_DB_NAME]
            .where(BLOCKED_VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.google)
            .toArray()
    )

    return {ruTotal, notRuTotal, byCharsTitle, byCharsChannelName, markerWords, google}
}