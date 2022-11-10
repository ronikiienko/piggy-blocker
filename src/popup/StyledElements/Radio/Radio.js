import PropTypes from 'prop-types';
import React from 'react';
import './Radio.css'

export const Radio = ({onChange, id, checked, name}) => {
    return (
        <input name={name} type="radio" id={id} onChange={onChange} checked={checked}/>
    );
};

Radio.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
    name: PropTypes.string
};