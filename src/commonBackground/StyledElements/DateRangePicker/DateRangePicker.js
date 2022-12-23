import React from 'react';
import {DatePicker} from '../DatePicker/DatePicker';


export const DateRangePicker = ({dateRange, setDateRange, withHours}) => {
    const changeHandler = (event) => {
        setDateRange(prevDateRange => ({
            ...prevDateRange,
            [event.target.id]: event.target.value
        }))
    }

    return (
        <>
            <DatePicker value={dateRange.fromDate} withHours={withHours}
                        label={chrome.i18n.getMessage('stats_filter_from')} id="fromDate" onChange={changeHandler}/>
            <DatePicker value={dateRange.toDate} withHours={withHours} label={chrome.i18n.getMessage('stats_filter_to')}
                        id="toDate" onChange={changeHandler}/>
        </>
    );
};