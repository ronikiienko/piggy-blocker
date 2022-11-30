import React from 'react';
import PropTypes from 'prop-types';
import './Input.css'

export const Input = ({value, onChange, label}) => {
    return (
        <label className="text-input-label">
            {label}
            <input className="text-input" type="text" value={value} onChange={onChange}/>
        </label>
    );
};

Input.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string
};