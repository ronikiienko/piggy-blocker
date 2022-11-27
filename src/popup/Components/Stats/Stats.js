import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {BLOCK_REASONS_MAP, BLOCKED_VIDEOS_DB_NAME, BLOCKED_VIDEOS_DB_KEYS} from '../../../common/consts';
import {db} from '../../../commonBackground/db';



export const Stats = () => {
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
    if (!byCharsTitle || !byCharsChannelName || !markerWords || !google) return null
    const totalBlocked = byCharsTitle.length + byCharsChannelName.length + markerWords.length + google.length;
    return (
        <div>
            <h1>Статистика:</h1>
            <h3>Заблоковано за весь час:</h3>
            <p>{totalBlocked}</p>
            <h2>З них:</h2>
            <h3>За рос. буквами в назві:</h3>
            <p>{byCharsTitle.length} ({byCharsTitle.length / totalBlocked * 100}%)</p>
            <h3>За рос. буквами в назві каналу:</h3>
            <p>{byCharsChannelName.length} ({byCharsChannelName.length / totalBlocked * 100}%)</p>
            <h3>За словами маркерами:</h3>
            <p>{markerWords.length} ({markerWords.length / totalBlocked * 100}%)</p>
            <h3>Google translate api:</h3>
            <p>{google.length} ({google.length / totalBlocked * 100}%)</p>
            {/*<p>{byCharsTitle.length + byCharsChannelName.length + markerWords.length + google.length}</p>*/}
        </div>
    );
};