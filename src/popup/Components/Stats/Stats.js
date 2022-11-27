import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {BLOCK_REASONS_MAP, BLOCKED_VIDEOS_DB_NAME, BLOCKED_VIDEOS_DB_KEYS} from '../../../common/consts';
import {countPercentage} from '../../../common/utils';
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
            <h3 title="Зараховується, якщо в назві відео знайдено специфічно російські літери">За рос. буквами в назві:</h3>
            <p>{byCharsTitle.length} ({countPercentage(byCharsTitle.length, totalBlocked, 0)}%)</p>
            <h3 title="Зараховується, якщо в назві каналу знайдено специфічно російські літери">За рос. буквами в назві каналу:</h3>
            <p>{byCharsChannelName.length} ({countPercentage(byCharsChannelName.length, totalBlocked, 0)}%)</p>
            <h3 title="Зараховується, якщо назва відео містить хоч одне з невеликого списку найрозповсюдженіших російських слів">За словами маркерами:</h3>
            <p>{markerWords.length} ({countPercentage(markerWords.length, totalBlocked, 0)}%)</p>
            <h3 title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати">Google translate api:</h3>
            <p>{google.length} ({countPercentage(google.length, totalBlocked, 0)}%)</p>
            {/*<p>{byCharsTitle.length + byCharsChannelName.length + markerWords.length + google.length}</p>*/}
        </div>
    );
};