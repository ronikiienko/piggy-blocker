import PropTypes from 'prop-types';
import React from 'react';
import './Checkbox.css';


const getInputStyle = (theme) => {
    return {
        accentColor: theme.inputsBackground,
    }
}

export const Checkbox = ({onChange, id, checked}) => {
    return (
        <input className={`checkbox`} type="checkbox" id={id} onChange={onChange} checked={checked}/>
    );
};

Checkbox.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
};