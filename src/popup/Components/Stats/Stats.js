import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {
    BLOCK_REASONS_MAP,
    BLOCKED_VIDEOS_DB_NAME,
    BLOCKED_VIDEOS_DB_KEYS,
    RU_LIST_DB_NAME, NOT_RU_LIST_DB_NAME,
} from '../../../common/consts';
import {countPercentage} from '../../../common/utils';
import {db} from '../../../commonBackground/db';
import stats from '../../../stats/index.html'


console.log('ssssssssss', stats);
export const Stats = () => {
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
    if (!byCharsTitle || !byCharsChannelName || !markerWords || !google) return null
    const totalAnalyzedNumber = ruTotal.length + notRuTotal.length
    return (
        <div>
            <a href={stats} target="_blank">blah</a>
            <h1>Статистика:</h1>
            <h3>Проаналізовано за весь час:</h3>
            <span>Всього: {ruTotal.length + notRuTotal.length}</span>
            <br />
            <span>Знайдено рос. відео: {ruTotal.length} ({countPercentage(ruTotal.length, totalAnalyzedNumber)}%)</span>
            <br />
            <span>Не рос: {notRuTotal.length} ({countPercentage(notRuTotal.length, totalAnalyzedNumber)}%)</span>
            <br />
            <h2>З них:</h2>
            <h3 title="Зараховується, якщо в назві відео знайдено специфічно російські літери">За рос. буквами в назві:</h3>
            <p>{byCharsTitle.length} ({countPercentage(byCharsTitle.length, ruTotal.length)}%)</p>
            <h3 title="Зараховується, якщо в назві каналу знайдено специфічно російські літери">За рос. буквами в назві каналу:</h3>
            <p>{byCharsChannelName.length} ({countPercentage(byCharsChannelName.length, ruTotal.length)}%)</p>
            <h3 title="Зараховується, якщо назва відео містить хоч одне з невеликого списку найрозповсюдженіших російських слів">За словами маркерами:</h3>
            <p>{markerWords.length} ({countPercentage(markerWords.length, ruTotal.length)}%)</p>
            <h3 title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати">Google translate api:</h3>
            <p>{google.length} ({countPercentage(google.length, ruTotal.length)}%)</p>
            {/*<p>{byCharsTitle.length + byCharsChannelName.length + markerWords.length + google.length}</p>*/}
        </div>
    );
};