import React from 'react';
import {useNotRuList} from '../../../commonBackground/hooks/useNotRuList';
import {useRuList} from '../../../commonBackground/hooks/useRuList';
// import PropTypes from 'prop-types';
import './OverallStats.css';


export const OverallStats = () => {
    const ruList = useRuList()
    const notRuList = useNotRuList()
    // const totalAnalyzedNumber = ruTotal.length + notRuTotal.length
    return (
        <div className="overall-stats-container">
            <div className="total-blocked">Total: {ruList.all.length + notRuList.all.length}</div>
            <div className="ru-not-ru-container">
                <div>
                    <div className="language-overall">Ru: {ruList.all.length}</div>
                    <div>
                        <div title="Зараховується, якщо в назві відео знайдено специфічно російські літери" className="block-reason">Рос. літери в назві: {ruList.byCharsTitle.length}</div>
                        <div title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати" className="block-reason">Google translate api: {ruList.google.length}</div>
                        <div title="Зараховується, якщо назва відео містить хоч одне з невеликого списку найрозповсюдженіших російських слів" className="block-reason">За словами маркерами: {ruList.markerWords.length}</div>
                        <div title="Зараховується, якщо в назві каналу знайдено специфічно російські літери" className="block-reason">Рос. літери в назві каналу: {ruList.byCharsChannelName.length}</div>
                    </div>
                </div>
                <div>
                    <div className="language-overall">Not ru: {notRuList.all.length}</div>
                    <div>
                        <div title="Зараховується, якщо в назві відео не знайдено кириличних літер" className="block-reason">Нема кирилиці в назві відео: {notRuList.noCyrillic.length}</div>
                        <div title="Зараховується, якщо в назві відео знайдено специфічно російські літери" className="block-reason">Укр. літери в назві: {notRuList.byCharsTitle.length}</div>
                        <div title="Якщо відео не пройшло по ніяким з попередніх пунктів, та містить хоч одну кириличну літеру, воно тоді, і тільки тоді відправляється до google translate, бо це досить довга задача, тому її використання треба мінімізувати" className="block-reason">Google translate api: {notRuList.google.length}</div>
                        <div title="Зараховується, якщо в назві каналу знайдено специфічно російські літери" className="block-reason">Рос. літери в назві каналу: {notRuList.byCharsChannelName.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// OverallStats.propTypes = {
//
// };