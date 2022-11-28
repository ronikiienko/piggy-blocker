import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'

export const Button = ({onClick, children, style}) => {
    return (
        <button style={style} onClick={onClick}>{children}</button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.any,
    style: PropTypes.object
};