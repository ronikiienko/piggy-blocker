import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {BLOCKED_VIDEOS_DB_KEYS, BLOCKED_VIDEOS_DB_NAME, REASON_FILTER_KEYS} from '../../../common/consts';
import {getReadableDate} from '../../../common/utils';
import {db} from '../../../commonBackground/db';
import {DateRangePicker} from '../../../commonBackground/StyledElements/DateRangePicker/DateRangePicker';
import {Input} from '../../../commonBackground/StyledElements/Input/Input';
import {Link} from '../../../commonBackground/StyledElements/Link/Link';
import {Select} from '../../../commonBackground/StyledElements/Select/Select';
import './ForTimePeriod.css';


const selectOptions = [
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
];
export const ForTimePeriod = () => {
    const [dateRange, setDateRange] = React.useState({fromDate: '', toDate: ''});
    const [reasonFilter, setReasonFilter] = React.useState(REASON_FILTER_KEYS.any);
    const [searchFilter, setSearchFilter] = React.useState('');

    // TODO sometimes new day records come with old. probably problem with gmt+2:00
    const blockedInRange = useLiveQuery(
        () => db[BLOCKED_VIDEOS_DB_NAME]
            .where(BLOCKED_VIDEOS_DB_KEYS.timeWhenBlocked)
            .between(
                new Date(dateRange.fromDate)?.getTime() || 0,
                new Date(dateRange.toDate)?.getTime() || Infinity,
            )
            .toArray(),
        [dateRange.fromDate, dateRange.toDate],
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
                    options={selectOptions}
                    value={reasonFilter}
                    onChange={(event) => setReasonFilter(event.target.value)}
                />
                <Input
                    label="Search filter:"
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value)}
                />
            </div>
            <div className="blocked-items-container">
                {blockedInRange.map((blockedItem) => {
                    if (blockedItem[BLOCKED_VIDEOS_DB_KEYS.reason] !== reasonFilter && reasonFilter !== REASON_FILTER_KEYS.any) return null;
                    if (searchFilter && !(blockedItem[BLOCKED_VIDEOS_DB_KEYS.title]?.toLowerCase()?.includes(searchFilter.toLowerCase()) || blockedItem[BLOCKED_VIDEOS_DB_KEYS.channelName]?.toLowerCase()?.includes(searchFilter.toLowerCase()))) return null;
                    const date = new Date(blockedItem[BLOCKED_VIDEOS_DB_KEYS.timeWhenBlocked]);
                    return <div className="blocked-item" key={blockedItem.id}>
                        <div className="block-details">{getReadableDate(date)}</div>
                        <Link
                            href={blockedItem[BLOCKED_VIDEOS_DB_KEYS.link]}
                            text={blockedItem[BLOCKED_VIDEOS_DB_KEYS.title]}
                        />
                        <span className="channel-name">
                            - {blockedItem[BLOCKED_VIDEOS_DB_KEYS.channelName] || 'Short video'}
                        </span>
                    </div>;
                })}
            </div>
        </div>
    );
};