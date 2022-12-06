import React from 'react';
import {countPercentage} from '../../../common/utils';
import {useNotRuList} from '../../../commonBackground/hooks/useNotRuList';
import {useRuList} from '../../../commonBackground/hooks/useRuList';


export const Stats = () => {
    const ruList = useRuList()
    const notRuList = useNotRuList()
    // const [recentList, setRecentList] = React.useState();
    // React.useEffect(() => {
    //     setRecentList(blockedInRange.filter(listItem => {
    //
    //     }).reverse());
    // }, [ruList, notRuList]);
    const totalAnalyzedNumber = ruList.all.length + notRuList.all.length
    return (
        <div>
            <a href={chrome.runtime.getURL('stats/index.html')} target="_blank"  rel="noreferrer">blah</a>
            <h1>Статистика:</h1>
            <h3>Проаналізовано за весь час:</h3>
            <span>Всього: {ruList.all.length + notRuList.all.length}</span>
            <br />
            <span>Знайдено рос. відео: {ruList.all.length} ({countPercentage(ruList.all.length, totalAnalyzedNumber)}%)</span>
            <br />
            <span>Не рос: {notRuList.all.length} ({countPercentage(notRuList.all.length, totalAnalyzedNumber)}%)</span>
            <br />
            <h2>З них:</h2>
            <h3 title="Зараховується, якщо в назві відео знайдено специфічно російські літери">За рос. літерами в назві:</h3>
            <p>{ruList.byCharsTitle.length} ({countPercentage(ruList.byCharsTitle.length, ruList.all.length)}%)</p>
            <h3 title="Зараховується, якщо в назві каналу знайдено специфічно російські літери">За рос. літерами в назві каналу:</h3>
            <p>{ruList.byCharsChannelName.length} ({countPercentage(ruList.byCharsChannelName.length, ruList.all.length)}%)</p>
            <h3 title="Зараховується, якщо назва відео містить хоч одне з невеликого списку найрозповсюдженіших російських слів">За словами маркерами:</h3>
            <p>{ruList.markerWords.length} ({countPercentage(ruList.markerWords.length, ruList.all.length)}%)</p>
            <h3 title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати">Google translate api:</h3>
            <p>{ruList.google.length} ({countPercentage(ruList.google.length, ruList.all.length)}%)</p>
        </div>
    );
};