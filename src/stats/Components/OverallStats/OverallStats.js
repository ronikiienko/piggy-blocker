import React from 'react';
import {countPercentage} from '../../../common/utils';
import {useNotRuList} from '../../../commonBackground/hooks/useNotRuList';
import {useRuList} from '../../../commonBackground/hooks/useRuList';
// import PropTypes from 'prop-types';
import './OverallStats.css';


export const OverallStats = () => {
    const notRuList = useNotRuList();
    const ruList = useRuList();
    const totalAnalyzedNumber = ruList.all.length + notRuList.all.length;
    return (
        <div className="overall-stats-container">
            <div className="ru-not-ru-container">
                <div>
                    <div
                        className="language-overall"
                    >
                        {chrome.i18n.getMessage('stats_page_ru_total')} {ruList.all.length} / {totalAnalyzedNumber} ({countPercentage(ruList.all.length, totalAnalyzedNumber)}%)
                    </div>
                    <div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_ru_ru_chars_title_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_ru_ru_chars_title')} {ruList.byCharsTitle.length} ({countPercentage(ruList.byCharsTitle.length, ruList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_ru_google_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_ru_google')} {ruList.google.length} ({countPercentage(ruList.google.length, ruList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_ru_ru_words_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_ru_ru_words')} {ruList.markerWords.length} ({countPercentage(ruList.markerWords.length, ruList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_ru_ru_chars_channel_name_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_ru_ru_chars_channel_name')} {ruList.byCharsChannelName.length} ({countPercentage(ruList.byCharsChannelName.length, ruList.all.length)}%)
                        </div>
                    </div>
                </div>
                <div>
                    <div className="language-overall"
                    >
                        {chrome.i18n.getMessage('stats_page_not_ru_total')} {notRuList.all.length} / {totalAnalyzedNumber} ({countPercentage(notRuList.all.length, totalAnalyzedNumber)}%)
                    </div>
                    <div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_not_ru_no_cyrillic_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_not_ru_no_cyrillic')} {notRuList.noCyrillic.length} ({countPercentage(notRuList.noCyrillic.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_not_ru_ukr_chars_title_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_not_ru_ukr_chars_title')} {notRuList.byCharsTitle.length} ({countPercentage(notRuList.byCharsTitle.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_not_ru_google_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_not_ru_google')} {notRuList.google.length} ({countPercentage(notRuList.google.length, notRuList.all.length)}%)
                        </div>
                        <div
                            title={chrome.i18n.getMessage('stats_page_not_ru_ukr_chars_channel_name_help')}
                            className="block-reason"
                        >
                            {chrome.i18n.getMessage('stats_page_not_ru_ukr_chars_channel_name')} {notRuList.byCharsChannelName.length} ({countPercentage(notRuList.byCharsChannelName.length, notRuList.all.length)}%)
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