import React from 'react';
import {VIDEOS_DB_KEYS} from '../../../common/consts';
import {countPercentage} from '../../../common/utils';
import {useNotRuList} from '../../../commonBackground/hooks/useNotRuList';
import {useRuList} from '../../../commonBackground/hooks/useRuList';
// import PropTypes from 'prop-types';
import './OverallStats.css';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';


export const OverallStats = () => {
    const notRuList = useNotRuList();
    const ruList = useRuList();
    // const [usedWords, setUsedWords] = React.useState([])
    const detectWords = () => {
        const markers = new Set(['больше', 'будет', 'будут', 'во', 'вообще', 'вот', 'время', 'всего', 'всем', 'всех', 'где', 'его', 'если', 'есть', 'еще', 'и', 'из', 'или', 'им', 'именно', 'интересно', 'их', 'к', 'как', 'какие', 'какой', 'когда', 'конечно', 'кто', 'лет', 'ли', 'либо', 'лучше', 'меня', 'мне', 'много', 'может', 'можно', 'надо', 'налоги', 'например', 'нет', 'ни', 'но', 'нужно', 'они', 'отвечаю', 'очень', 'под', 'после', 'почему', 'работать', 'с', 'сейчас', 'со', 'стоит', 'такое', 'такой', 'теперь', 'только', 'украине', 'чем', 'что']);
        const allWords = []
        let analyzedTitles = []
        for (let ruItem of ruList.google) {
            const title = ruItem[VIDEOS_DB_KEYS.title]
            if (analyzedTitles.includes(title)) {
                console.log('title already analyzed', title);
                continue
            }
            analyzedTitles.push(title)
            const words = title.split(' ')
            for (let word of words) {
                if (markers.has(word.toLowerCase())) {
                    console.log(title, 'hmmmm');
                }
                allWords[word] = allWords?.[word] ? allWords[word] + 1 : 1
            }
        }
        let sortable = [];
        for (let word in allWords) {
            sortable.push([word, allWords[word]]);
        }
        const sorted = sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        const filtered = sorted.filter((value) => {
            return value[1] > 2 && value[0].match(/\p{L}/gu);
        })
        console.log(filtered);
        // setUsedWords(allWords)
    }
    const totalAnalyzedNumber = ruList.all.length + notRuList.all.length;
    return (
        <div className="overall-stats-container">
            <Button onClick={detectWords}>Count word stats</Button>
            <div
                className="total-blocked"
            >
                Total: {ruList.all.length + notRuList.all.length}
            </div>
            <div className="ru-not-ru-container">
                <div>
                    <div
                        className="language-overall"
                    >
                        Ru: {ruList.all.length} ({countPercentage(ruList.all.length, totalAnalyzedNumber)}%)
                    </div>
                    <div>
                        <div
                            title="Зараховується, якщо в назві відео знайдено специфічно російські літери"
                            className="block-reason"
                        >
                            Рос. літери в
                            назві: {ruList.byCharsTitle.length} ({countPercentage(ruList.byCharsTitle.length, ruList.all.length)}%)
                        </div>
                        <div
                            title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати"
                            className="block-reason"
                        >
                            Google translate
                            api: {ruList.google.length} ({countPercentage(ruList.google.length, ruList.all.length)}%)
                        </div>
                        <div
                            title="Зараховується, якщо назва відео містить хоч одне з невеликого списку найрозповсюдженіших російських слів"
                            className="block-reason"
                        >
                            За словами
                            маркерами: {ruList.markerWords.length} ({countPercentage(ruList.markerWords.length, ruList.all.length)}%)
                        </div>
                        <div
                            title="Зараховується, якщо в назві каналу знайдено специфічно російські літери"
                            className="block-reason"
                        >
                            Рос. літери в назві
                            каналу: {ruList.byCharsChannelName.length} ({countPercentage(ruList.byCharsChannelName.length, ruList.all.length)}%)
                        </div>
                    </div>
                </div>
                <div>
                    <div className="language-overall"
                    >
                        Not ru: {notRuList.all.length} ({countPercentage(notRuList.all.length, totalAnalyzedNumber)}%)
                    </div>
                    <div>
                        <div
                            title="Зараховується, якщо в назві відео не знайдено кириличних літер"
                            className="block-reason"
                        >
                            Нема кирилиці в назві
                            відео: {notRuList.noCyrillic.length} ({countPercentage(notRuList.noCyrillic.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title="Зараховується, якщо в
                            назві відео знайдено специфічно російські літери"
                            className="block-reason"
                        >
                            Укр. літери в
                            назві: {notRuList.byCharsTitle.length} ({countPercentage(notRuList.byCharsTitle.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати"
                            className="block-reason"
                        >
                            Google translate
                            api: {notRuList.google.length} ({countPercentage(notRuList.google.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title="Зараховується, якщо в назві каналу знайдено специфічно російські літери"
                            className="block-reason"
                        >
                            Укр. літери в назві
                            каналу: {notRuList.byCharsChannelName.length} ({countPercentage(notRuList.byCharsChannelName.length, notRuList.all.length)}%)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// OverallStats.propTypes = {
//
// };