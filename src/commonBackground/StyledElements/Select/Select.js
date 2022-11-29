import PropTypes from 'prop-types';
import React from 'react';
import './Select.css'

export const Select = ({options, value, onChange, label}) => {
    if (!options) return null
    return (
        <label className="select-input-label">
            {label}
            <select className="select-input" value={value} onChange={onChange}>
                {options.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    );
                })}
            </select>
        </label>
    );
};

Select.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
    })),
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string
};