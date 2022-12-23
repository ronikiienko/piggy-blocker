import {useLiveQuery} from 'dexie-react-hooks';
import {BLOCK_REASONS_MAP, CHECKED_VIDEOS_DB_KEYS, CHECKED_VIDEOS_DB_NAME} from '../../common/consts';
import {db} from '../db';


export const useCheckedVideosList = () => {
    // TODO review performance of this hook
    const all = useLiveQuery(
        () => db[CHECKED_VIDEOS_DB_NAME].toArray(),
        [],
        [],
    );
    const ru = useLiveQuery(
        () => db[CHECKED_VIDEOS_DB_NAME]
            .where(CHECKED_VIDEOS_DB_KEYS.isRu)
            .equals(1)
            .toArray(),
    );
    const notRu = useLiveQuery(
        () => db[CHECKED_VIDEOS_DB_NAME]
            .where(CHECKED_VIDEOS_DB_KEYS.isRu)
            .equals(0)
            .toArray(),
    );
    const byCharsTitle = useLiveQuery(
        () => db[CHECKED_VIDEOS_DB_NAME]
            .where(CHECKED_VIDEOS_DB_KEYS.reason)
            .equals(BLOCK_REASONS_MAP.byCharsTitle)
            .toArray(),
        [],
        [],
    );
    const byCharsChannelName = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.byCharsChannelName)
                .toArray(),
        [],
        [],
    );
    const markerWords = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.markerWords)
                .toArray(),
        [],
        [],
    );
    const noCyrillic = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.noCyrillic)
                .toArray(),
        [],
        [],
    );
    const google = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.reason)
                .equals(BLOCK_REASONS_MAP.google)
                .toArray(),
        [],
        [],
    );

    return {all, ru, notRu, noCyrillic, byCharsTitle, byCharsChannelName, markerWords, google};
};