import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {
    DEFAULT_FILTERS,
    NOT_RU_LIST_DB_NAME,
    REASON_FILTER_KEYS,
    RU_LIST_DB_NAME,
    VIDEOS_DB_KEYS,
} from '../../../common/consts';
import {getReadableDate} from '../../../common/utils';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {DateRangePicker} from '../../../commonBackground/StyledElements/DateRangePicker/DateRangePicker';
import {Input} from '../../../commonBackground/StyledElements/Input/Input';
import {Link} from '../../../commonBackground/StyledElements/Link/Link';
import {Select} from '../../../commonBackground/StyledElements/Select/Select';
import './FilteredStats.css';


const languageSelectOptions = [
    {
        label: RU_LIST_DB_NAME,
        value: RU_LIST_DB_NAME,
    },
    {
        label: NOT_RU_LIST_DB_NAME,
        value: NOT_RU_LIST_DB_NAME,
    },
];

const reasonSelectOptions = [
    {
        label: REASON_FILTER_KEYS.any,
        value: REASON_FILTER_KEYS.any,
    },
    {
        label: REASON_FILTER_KEYS.byCharsTitle,
        value: REASON_FILTER_KEYS.byCharsTitle,
    },
    {
        label: REASON_FILTER_KEYS.byCharsChannelName,
        value: REASON_FILTER_KEYS.byCharsChannelName,
    },
    {
        label: REASON_FILTER_KEYS.google,
        value: REASON_FILTER_KEYS.google,
    },
    {
        label: REASON_FILTER_KEYS.markerWords,
        value: REASON_FILTER_KEYS.markerWords,
    },
    {
        label: REASON_FILTER_KEYS.noCyrillic,
        value: REASON_FILTER_KEYS.noCyrillic,
    },
];
export const FilteredStats = () => {
    console.log('rerender');
    const [dateRange, setDateRange] = React.useState(DEFAULT_FILTERS.dateRange);
    const [reasonFilter, setReasonFilter] = React.useState(DEFAULT_FILTERS.reasonFilter);
    const [searchFilter, setSearchFilter] = React.useState(DEFAULT_FILTERS.searchFilter);
    const [languageFilter, setLanguageFilter] = React.useState(DEFAULT_FILTERS.languageFilter);
    const [filteredList, setFilteredList] = React.useState([]);

    // TODO sometimes new day records come with old. probably problem with gmt+2:00
    const blockedInRange = useLiveQuery(
        () => db[languageFilter]
            .where(VIDEOS_DB_KEYS.timeWhenBlocked)
            .between(
                new Date(dateRange.fromDate)?.getTime() || 0,
                new Date(dateRange.toDate)?.getTime() || Infinity,
            )
            .toArray(),
        [dateRange.fromDate, dateRange.toDate, languageFilter],
        []
    );
    // TODO +1 rerender happens somehow
    React.useEffect(() => {
        setFilteredList(blockedInRange.filter(listItem => {
            return (
                (reasonFilter &&
                    (listItem[VIDEOS_DB_KEYS.reason] === reasonFilter ||
                        reasonFilter === REASON_FILTER_KEYS.any)) &&
                (
                    (listItem[VIDEOS_DB_KEYS.title]?.toLowerCase()?.includes(searchFilter.toLowerCase()) ||
                        listItem[VIDEOS_DB_KEYS.channelName]?.toLowerCase()?.includes(searchFilter.toLowerCase())
                    )
                )
            );
        }));
    }, [blockedInRange, reasonFilter, searchFilter, languageFilter]);
    if (!blockedInRange) return null;

    const detectWords = () => {
        const allWords = [];
        let analyzedTitles = [];
        for (let ruItem of filteredList) {
            const title = ruItem[VIDEOS_DB_KEYS.title];
            if (analyzedTitles.includes(title)) {
                console.log('title already analyzed', title);
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
        let sortable = [];
        for (let word in allWords) {
            sortable.push([word, allWords[word]]);
        }
        const sorted = sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        const filtered = sorted.filter((value) => {
            return value[1] > 3 && value[0].match(/\p{L}/gu);
        });
        console.log(filtered);
        // setUsedWords(allWords)
    };
    return (
        <div>
            <div className="search-container">
                <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    withHours={true}
                />
                <Select
                    label="Причина детекту:"
                    options={reasonSelectOptions}
                    value={reasonFilter}
                    onChange={(event) => setReasonFilter(event.target.value)}
                />
                <Select
                    label="Результат детекту:"
                    options={languageSelectOptions}
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value)}
                />
                <Input
                    label="Пошук:"
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value)}
                />
                <Button onClick={detectWords}>Count word stats</Button>

            </div>
            <div className="blocked-items-container">
                {filteredList.map((listItem) => {
                    const date = new Date(listItem[VIDEOS_DB_KEYS.timeWhenBlocked]);
                    return <div className="blocked-item" key={listItem[VIDEOS_DB_KEYS.ytId]}>
                        <div className="item-block-details">
                            <span>{getReadableDate(date)}</span>
                            <span
                                className="item-block-reason">{listItem[VIDEOS_DB_KEYS.reason]} {listItem?.[VIDEOS_DB_KEYS.reasonDetails] ? `(${listItem?.[VIDEOS_DB_KEYS.reasonDetails]})` : ''}</span>
                            <span className="item-yt-id">{listItem[VIDEOS_DB_KEYS.ytId]}</span>
                        </div>
                        <Link
                            href={listItem[VIDEOS_DB_KEYS.link]}
                            text={listItem[VIDEOS_DB_KEYS.title]}
                        />
                        <span className="item-channel-name">
                            - {listItem[VIDEOS_DB_KEYS.channelName] || 'Short video'}
                        </span>
                    </div>;
                })}
            </div>
        </div>
    );
};