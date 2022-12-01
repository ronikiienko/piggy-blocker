import {useLiveQuery} from 'dexie-react-hooks';
import {BLOCK_REASONS_MAP, NOT_RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../../common/consts';
import {db} from '../db';


export const useNotRuList = () => {
    // TODO review performance of this hook
    const all = useLiveQuery(
        () => db[NOT_RU_LIST_DB_NAME].toArray(),
        [],
        []
    )
    const byCharsTitle = useLiveQuery(
        () => db[NOT_RU_LIST_DB_NAME]
            .where(VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsTitle)
            .toArray(),
        [],
        []
    )
    const byCharsChannelName = useLiveQuery(() =>
            db[NOT_RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.byCharsChannelName)
                .toArray(),
        [],
        []
    )
    const markerWords = useLiveQuery(() =>
            db[NOT_RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.markerWords)
                .toArray(),
        [],
        []
    )
    const noCyrillic = useLiveQuery(() =>
            db[NOT_RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.noCyrillic)
                .toArray(),
        [],
        []
    )
    const google = useLiveQuery(() =>
            db[NOT_RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.google)
                .toArray(),
        [],
        []
    )

    return {all, noCyrillic, byCharsTitle, byCharsChannelName, markerWords, google}
}