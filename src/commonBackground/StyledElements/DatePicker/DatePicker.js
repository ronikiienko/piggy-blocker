import PropTypes from 'prop-types';
import React from 'react';
import './DatePicker.css';


export const DatePicker = ({withHours, value, onChange, id, label}) => {
    return (
        <span className="date-picker-container">
            <label className="date-picker-label" htmlFor={id}>
                {label}
                <input id={id} value={value} type={withHours ? 'datetime-local' : 'date'} className="date-picker" onChange={onChange}/>
            </label>
        </span>
    );
};

DatePicker.propTypes = {
    withHours: PropTypes.bool,
    onChange: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string
};