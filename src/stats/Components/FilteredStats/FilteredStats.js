import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import ViewportList from 'react-viewport-list';
import {
    DEFAULT_FILTERS,
    NOT_RU_LIST_DB_NAME,
    REASON_FILTER_KEYS,
    RU_LIST_DB_NAME,
    VIDEOS_DB_KEYS,
} from '../../../common/consts';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {DateRangePicker} from '../../../commonBackground/StyledElements/DateRangePicker/DateRangePicker';
import {Input} from '../../../commonBackground/StyledElements/Input/Input';
import {Select} from '../../../commonBackground/StyledElements/Select/Select';
import './FilteredStats.css';
import {ListItem} from './ListItem';


const languageSelectOptions = [
    {
        label: 'Російське',
        value: RU_LIST_DB_NAME,
    },
    {
        label: 'Не російське',
        value: NOT_RU_LIST_DB_NAME,
    },
];

const reasonSelectOptions = [
    {
        label: 'Будь-які',
        value: REASON_FILTER_KEYS.any,
    },
    {
        label: 'По літерам в назві відео',
        value: REASON_FILTER_KEYS.byCharsTitle,
    },
    {
        label: 'По літерам в назві каналу',
        value: REASON_FILTER_KEYS.byCharsChannelName,
    },
    {
        label: 'Бо гугл так вирішив',
        value: REASON_FILTER_KEYS.google,
    },
    {
        label: 'По словам-маркерам',
        value: REASON_FILTER_KEYS.markerWords,
    },
    {
        label: 'Не знайдено кирилиці',
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
            .reverse()
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
    const listContainerRef = React.useRef(null);
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
        console.log(allWords);
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
            <div className="search-container">
                <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    withHours={true}
                />
                <Button onClick={detectWords}>Count word stats</Button>
                <br />
                <Select
                    label="Причина:"
                    options={reasonSelectOptions}
                    value={reasonFilter}
                    onChange={(event) => setReasonFilter(event.target.value)}
                />
                <Select
                    label="Результат:"
                    options={languageSelectOptions}
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value)}
                />
                <Input
                    label="Пошук:"
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
                        return <ListItem key={listItem[VIDEOS_DB_KEYS.ytId]} listItem={listItem} index={index} />
                    })}
                </ViewportList>
                {/*{filteredList.map((listItem, index) => {*/}
                {/*    return <ListItem key={listItem[VIDEOS_DB_KEYS.ytId]} listItem={listItem} index={index} />*/}
                {/*})}*/}
            </div>
        </div>
    );
};