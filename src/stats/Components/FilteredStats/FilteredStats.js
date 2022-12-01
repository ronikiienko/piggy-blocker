import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {
    VIDEOS_DB_KEYS,
    BLOCKED_VIDEOS_DB_NAME,
    REASON_FILTER_KEYS,
    RU_LIST_DB_NAME,
    LANGUAGE_FILTER_KEYS, NOT_RU_LIST_DB_NAME,
} from '../../../common/consts';
import {getReadableDate} from '../../../common/utils';
import {db} from '../../../commonBackground/db';
import {DateRangePicker} from '../../../commonBackground/StyledElements/DateRangePicker/DateRangePicker';
import {Input} from '../../../commonBackground/StyledElements/Input/Input';
import {Link} from '../../../commonBackground/StyledElements/Link/Link';
import {Select} from '../../../commonBackground/StyledElements/Select/Select';
import './ForTimePeriod.css';


const languageSelectOptions = [
    {
        label: RU_LIST_DB_NAME,
        value: RU_LIST_DB_NAME
    },
    {
        label: NOT_RU_LIST_DB_NAME,
        value: NOT_RU_LIST_DB_NAME
    }
]

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
        value: REASON_FILTER_KEYS.noCyrillic
    }
];
export const FilteredStats = () => {
    console.log('rerender');
    const [dateRange, setDateRange] = React.useState({fromDate: '', toDate: ''});
    const [reasonFilter, setReasonFilter] = React.useState(REASON_FILTER_KEYS.any);
    const [searchFilter, setSearchFilter] = React.useState('');
    const [languageFilter, setLanguageFilter] = React.useState(RU_LIST_DB_NAME);

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
    );
    if (!blockedInRange) return null;
    return (
        <div>
            <div className="search-container">
                <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
                <Select
                    label="Reason filter:"
                    options={reasonSelectOptions}
                    value={reasonFilter}
                    onChange={(event) => setReasonFilter(event.target.value)}
                />
                <Select
                    label="Language filter:"
                    options={languageSelectOptions}
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value)}
                />
                <Input
                    label="Search filter:"
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value)}
                />
            </div>
            <div className="blocked-items-container">
                {blockedInRange.map((blockedItem) => {
                    if (blockedItem[VIDEOS_DB_KEYS.reason] !== reasonFilter && reasonFilter !== REASON_FILTER_KEYS.any) return null;
                    if (searchFilter && !(blockedItem[VIDEOS_DB_KEYS.title]?.toLowerCase()?.includes(searchFilter.toLowerCase()) || blockedItem[VIDEOS_DB_KEYS.channelName]?.toLowerCase()?.includes(searchFilter.toLowerCase()))) return null;
                    const date = new Date(blockedItem[VIDEOS_DB_KEYS.timeWhenBlocked]);
                    return <div className="blocked-item" key={blockedItem[VIDEOS_DB_KEYS.ytId]}>
                        <div className="item-block-details">
                            <span>{getReadableDate(date)}</span>
                            <span className="item-block-reason">{blockedItem[VIDEOS_DB_KEYS.reason]} {blockedItem?.[VIDEOS_DB_KEYS.reasonDetails] ? `(${blockedItem?.[VIDEOS_DB_KEYS.reasonDetails]})` : ''}</span>
                            <span className="item-yt-id">{blockedItem[VIDEOS_DB_KEYS.ytId]}</span>
                        </div>
                        <Link
                            href={blockedItem[VIDEOS_DB_KEYS.link]}
                            text={blockedItem[VIDEOS_DB_KEYS.title]}
                        />
                        <span className="item-channel-name">
                            - {blockedItem[VIDEOS_DB_KEYS.channelName] || 'Short video'}
                        </span>
                    </div>;
                })}
            </div>
        </div>
    );
};