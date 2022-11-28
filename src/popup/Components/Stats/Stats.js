import React from 'react';
import {countPercentage} from '../../../common/utils';
import {useStats} from '../../../commonBackground/useStats';


export const Stats = () => {
    const {ruTotal, notRuTotal, markerWords, byCharsChannelName, byCharsTitle, google} = useStats()
    if (!byCharsTitle || !byCharsChannelName || !markerWords || !google) return null
    const totalAnalyzedNumber = ruTotal.length + notRuTotal.length
    return (
        <div>
            <a href={chrome.runtime.getURL('stats/index.html')} target="_blank">blah</a>
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