import {useLiveQuery} from 'dexie-react-hooks';
import {BLOCK_REASONS_MAP, RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../../common/consts';
import {db} from '../db';


export const useRuList = () => {
    // TODO review performance of this hook
    const all = useLiveQuery(
        () => db[RU_LIST_DB_NAME].toArray(),
        [],
        []
    )
    const byCharsTitle = useLiveQuery(
        () => db[RU_LIST_DB_NAME]
            .where(VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsTitle)
            .toArray(),
        [],
        []
    )
    const byCharsChannelName = useLiveQuery(() =>
        db[RU_LIST_DB_NAME]
            .where(VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsChannelName)
            .toArray(),
        [],
        []
    )
    const markerWords = useLiveQuery(() =>
        db[RU_LIST_DB_NAME]
            .where(VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.markerWords)
            .toArray(),
        [],
        []
    )
    const google = useLiveQuery(() =>
        db[RU_LIST_DB_NAME]
            .where(VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.google)
            .toArray(),
        [],
        []
    )

    return {all, byCharsTitle, byCharsChannelName, markerWords, google}
}