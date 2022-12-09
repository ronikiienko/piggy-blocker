import PropTypes from 'prop-types';
import React from 'react';
import './Checkbox.css';

export const Checkbox = ({onChange, id, checked, label, disabled}) => {
    return (
        <div className="checkbox-container">
            <input disabled={disabled} id={id} className="checkbox-input" type="checkbox" checked={checked} onChange={onChange} />
            <label className="checkbox-label" htmlFor={id}>{label}</label>
        </div>
    );
};

Checkbox.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
    label: PropTypes.string,
    disabled: PropTypes.bool
};