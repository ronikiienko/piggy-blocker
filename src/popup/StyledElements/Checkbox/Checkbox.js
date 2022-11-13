import PropTypes from 'prop-types';
import React from 'react';
import './Checkbox.css';


const getInputStyle = (theme) => {
    return {
        accentColor: theme.inputsBackground,
    }
}

export const Checkbox = ({onChange, id, checked, label}) => {
    return (
        <div className="checkbox-container">
            <input id={id} className="checkbox-input" type="checkbox" checked={checked} onChange={onChange} />
            <label className="checkbox-label" htmlFor={id}>{label}</label>
        </div>
    );
};

Checkbox.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
    label: PropTypes.string
};