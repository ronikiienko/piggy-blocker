import {useLiveQuery} from 'dexie-react-hooks';
import React, {useState} from 'react';
import ViewportList from 'react-viewport-list';
import {
    BLOCK_REASONS_MAP,
    CHECKED_VIDEOS_DB_KEYS,
    CHECKED_VIDEOS_DB_NAME,
    DEFAULT_FILTERS,
    LANGUAGE_FILTER_KEYS,
    REASON_FILTER_KEYS,
} from '../../../common/consts';
import {countPercentage} from '../../../common/utils';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {DateRangePicker} from '../../../commonBackground/StyledElements/DateRangePicker/DateRangePicker';
import {Input} from '../../../commonBackground/StyledElements/Input/Input';
import {Select} from '../../../commonBackground/StyledElements/Select/Select';
import './FilteredStats.css';
import {ListItem} from './ListItem';


const languageSelectOptions = [
    {
        label: chrome.i18n.getMessage('stats_filter_result_ru_option'),
        value: LANGUAGE_FILTER_KEYS['1'],
    },
    {
        label: chrome.i18n.getMessage('stats_filter_result_not_ru_option'),
        value: LANGUAGE_FILTER_KEYS['0'],
    },
    {
        label: chrome.i18n.getMessage('stats_filter_result_any_option'),
        value: LANGUAGE_FILTER_KEYS.any,
    },
];

const reasonSelectOptions = [
    {
        label: chrome.i18n.getMessage('stats_filter_reason_any_option'),
        value: REASON_FILTER_KEYS.any,
    },
    {
        label: chrome.i18n.getMessage('stats_filter_reason_chars_title_option'),
        value: REASON_FILTER_KEYS.byCharsTitle,
    },
    {
        label: chrome.i18n.getMessage('stats_filter_reason_chars_channel_name_option'),
        value: REASON_FILTER_KEYS.byCharsChannelName,
    },
    {
        label: chrome.i18n.getMessage('stats_filter_reason_google_option'),
        value: REASON_FILTER_KEYS.google,
    },
    {
        label: chrome.i18n.getMessage('stats_filter_reason_words_option'),
        value: REASON_FILTER_KEYS.markerWords,
    },
    {
        label: chrome.i18n.getMessage('stats_filter_reason_no_cyrillic_option'),
        value: REASON_FILTER_KEYS.noCyrillic,
    },
];
export const FilteredStats = () => {
    // console.log('rerender');
    const [dateRange, setDateRange] = React.useState(DEFAULT_FILTERS.dateRange);
    const [reasonFilter, setReasonFilter] = React.useState(DEFAULT_FILTERS.reasonFilter);
    const [searchFilter, setSearchFilter] = React.useState(DEFAULT_FILTERS.searchFilter);
    const [languageFilter, setLanguageFilter] = React.useState(DEFAULT_FILTERS.languageFilter);
    // console.log(languageFilter);
    // TODO sometimes new day records come with old. probably problem with gmt+2:00
    const filteredList = useLiveQuery(
        () => db[CHECKED_VIDEOS_DB_NAME]
            .where(CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked)
            .between(
                new Date(dateRange.fromDate)?.getTime() || 0,
                new Date(dateRange.toDate)?.getTime() || Infinity,
            )
            .and(listItem => (listItem[CHECKED_VIDEOS_DB_KEYS.title]?.toLowerCase()?.includes(searchFilter.toLowerCase()) || listItem[CHECKED_VIDEOS_DB_KEYS.channelName]?.toLowerCase()?.includes(searchFilter.toLowerCase())))
            .and(listItem => (listItem[CHECKED_VIDEOS_DB_KEYS.isRu] === Number(languageFilter) || languageFilter === LANGUAGE_FILTER_KEYS.any))
            .and(listItem => (listItem[CHECKED_VIDEOS_DB_KEYS.reason] === reasonFilter || reasonFilter === REASON_FILTER_KEYS.any))
            .reverse()
            .toArray(),
        [dateRange.fromDate, dateRange.toDate, languageFilter, reasonFilter, searchFilter],
        [],
    );
    const [overallNumbers, setOverallNumbers] = useState({
        [BLOCK_REASONS_MAP.byCharsTitle]: 0,
        [BLOCK_REASONS_MAP.byCharsChannelName]: 0,
        [BLOCK_REASONS_MAP.noCyrillic]: 0,
        [BLOCK_REASONS_MAP.markerWords]: 0,
        [BLOCK_REASONS_MAP.google]: 0,
    });
    // TODO +1 rerender happens somehow
    // TODO percents wrong
    // TODO sometimes videos are sent twice to backend
    // TODO reverse list
    React.useEffect(() => {
        let byCharsTitle = 0;
        let noCyrillic = 0;
        let markerWords = 0;
        let google = 0;
        let byCharsChannelName = 0;
        for (let videoItem of filteredList) {
            switch (videoItem[CHECKED_VIDEOS_DB_KEYS.reason]) {
                case BLOCK_REASONS_MAP.byCharsTitle:
                    byCharsTitle++;
                    break;
                case BLOCK_REASONS_MAP.noCyrillic:
                    noCyrillic++;
                    break;
                case BLOCK_REASONS_MAP.markerWords:
                    markerWords++;
                    break;
                case BLOCK_REASONS_MAP.google:
                    google++;
                    break;
                case BLOCK_REASONS_MAP.byCharsChannelName:
                    byCharsChannelName++;
                    break;
                default:
                    console.log('SUZUKI');
            }
        }
        console.log({
            [BLOCK_REASONS_MAP.byCharsTitle]: byCharsTitle,
            [BLOCK_REASONS_MAP.byCharsChannelName]: byCharsChannelName,
            [BLOCK_REASONS_MAP.noCyrillic]: noCyrillic,
            [BLOCK_REASONS_MAP.markerWords]: markerWords,
            [BLOCK_REASONS_MAP.google]: google,
        });
        setOverallNumbers({
            [BLOCK_REASONS_MAP.byCharsTitle]: byCharsTitle,
            [BLOCK_REASONS_MAP.byCharsChannelName]: byCharsChannelName,
            [BLOCK_REASONS_MAP.noCyrillic]: noCyrillic,
            [BLOCK_REASONS_MAP.markerWords]: markerWords,
            [BLOCK_REASONS_MAP.google]: google,
        });
    }, [filteredList]);
    const listContainerRef = React.useRef(null);
    if (!filteredList) return null;

    const detectWords = () => {
        const allWords = [];
        let analyzedTitles = [];
        for (let ruItem of filteredList) {
            const title = ruItem[CHECKED_VIDEOS_DB_KEYS.title];
            if (analyzedTitles.includes(title)) {
                // console.log('title already analyzed', title);
                continue;
            }
            analyzedTitles.push(title);
            const words = title.split(' ');
            for (let word of words) {
                word = word.toLowerCase();
                word = word.replace(/[.,()!]/g, '');
                allWords[word] = allWords?.[word] ? allWords[word] + 1 : 1;
            }
        }
        // console.log(allWords);
        let sortable = [];
        for (let word in allWords) {
            // console.log(word, allWords[word]);
            sortable.push([word, allWords[word]]);
        }
        const sorted = sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        let filtered = []
        filtered = sorted.filter((value) => {
            return value[1] > 2 && value[0].match(/\p{L}/gu);
        });
        console.log(filtered);
        // setUsedWords(allWords)
    };
    return (
        <div>
            <div className="overall-stats-container">
                <div
                    className="overall"
                >
                    {chrome.i18n.getMessage('stats_page_total')} {filteredList.length}
                </div>
                <div>
                    <div
                        title={chrome.i18n.getMessage('stats_page_chars_title_help')}
                        className="block-reason"
                    >
                        {chrome.i18n.getMessage('stats_page_chars_title')} {overallNumbers[BLOCK_REASONS_MAP.byCharsTitle]} ({countPercentage(overallNumbers[BLOCK_REASONS_MAP.byCharsTitle], filteredList.length)}%)
                    </div>
                    <div
                        title={chrome.i18n.getMessage('stats_page_google_help')}
                        className="block-reason"
                    >
                        {chrome.i18n.getMessage('stats_page_google')} {overallNumbers[BLOCK_REASONS_MAP.google]} ({countPercentage(overallNumbers[BLOCK_REASONS_MAP.google], filteredList.length)}%)
                    </div>
                    <div
                        title={chrome.i18n.getMessage('stats_page_marker_words_help')}
                        className="block-reason"
                    >
                        {chrome.i18n.getMessage('stats_page_marker_words')} {overallNumbers[BLOCK_REASONS_MAP.markerWords]} ({countPercentage(overallNumbers[BLOCK_REASONS_MAP.markerWords], filteredList.length)}%)
                    </div>
                    <div
                        title={chrome.i18n.getMessage('stats_page_chars_channel_name_help')}
                        className="block-reason"
                    >
                        {chrome.i18n.getMessage('stats_page_chars_channel_name')} {overallNumbers[BLOCK_REASONS_MAP.byCharsChannelName]} ({countPercentage(overallNumbers[BLOCK_REASONS_MAP.byCharsChannelName], filteredList.length)}%)
                    </div>
                    <div
                        title={chrome.i18n.getMessage('stats_page_no_cyrillic_help')}
                        className="block-reason"
                    >
                        {chrome.i18n.getMessage('stats_page_no_cyrillic')} {overallNumbers[BLOCK_REASONS_MAP.noCyrillic]} ({countPercentage(overallNumbers[BLOCK_REASONS_MAP.noCyrillic], filteredList.length)}%)
                    </div>
                </div>
            </div>
            <div className="search-container">
                <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    withHours={true}
                />
                <Button onClick={detectWords}
                        title={chrome.i18n.getMessage('stats_filter_count_word_stats_help')}>{chrome.i18n.getMessage('stats_filter_count_word_stats')}</Button>
                <br/>
                <Select
                    label={chrome.i18n.getMessage('stats_filter_reason')}
                    options={reasonSelectOptions}
                    value={reasonFilter}
                    onChange={(event) => setReasonFilter(event.target.value)}
                />
                <Select
                    label={chrome.i18n.getMessage('stats_filter_result')}
                    options={languageSelectOptions}
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value)}
                />
                <Input
                    label={chrome.i18n.getMessage('stats_filter_search')}
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value)}
                />
            </div>
            <div className="blocked-items-container" ref={listContainerRef}>
                <ViewportList
                    viewportRef={listContainerRef}
                    items={filteredList}
                >
                    {((listItem, index) => {
                        return <ListItem key={listItem[CHECKED_VIDEOS_DB_KEYS.ytId]} listItem={listItem} index={index}/>;
                    })}
                </ViewportList>
                {/*{filteredList.map((listItem, index) => {*/}
                {/*    return <ListItem key={listItem[CHECKED_VIDEOS_DB_KEYS.ytId]} listItem={listItem} index={index} />*/}
                {/*})}*/}
            </div>
        </div>
    );
};