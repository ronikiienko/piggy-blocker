import React from 'react';
import {DatePicker} from '../DatePicker/DatePicker';


export const DateRangePicker = ({dateRange, setDateRange}) => {
    console.log('date picker rerender');
    const changeHandler = (event) => {
        setDateRange(prevDateRange => ({
            ...prevDateRange,
            [event.target.id]: event.target.value
        }))
    }

    return (
        <>
            <DatePicker value={dateRange.fromDate} label="From date:" id="fromDate" onChange={changeHandler}/>
            <DatePicker value={dateRange.toDate} label="To date:" id="toDate" onChange={changeHandler}/>
        </>
    );
};