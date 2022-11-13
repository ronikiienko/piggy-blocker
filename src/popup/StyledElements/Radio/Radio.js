import PropTypes from 'prop-types';
import React from 'react';
import './Radio.css'

export const Radio = ({onChange, id, checked, name, label}) => {
    return (
        <div className="radio-container">
            <input id={id} className="radio-input" type="radio" checked={checked} onChange={onChange} name={name}/>
            <label className="radio-label" htmlFor={id}>{label}</label>
        </div>
    );
};

Radio.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
    name: PropTypes.string,
    label: PropTypes.string
};