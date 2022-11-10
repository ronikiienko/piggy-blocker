import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {ThemeContext} from '../../Main';
import './Checkbox.css'

const getInputStyle = (theme) => {
    return {
        accentColor: theme.inputsBackground,
    }
}

export const Checkbox = ({onChange, id, checked}) => {
    const theme = useContext(ThemeContext)
    return (
        <input className={`checkbox`} type="checkbox" id={id} onChange={onChange} checked={checked}/>
    );
};

Checkbox.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
};