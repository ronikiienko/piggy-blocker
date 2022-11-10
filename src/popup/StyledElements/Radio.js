import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {COLORS_DARK, COLORS_LIGHT} from '../../common/consts';
import {ThemeContext} from '../Main';


const getInputStyle = (theme) => {
    return {
        accentColor: theme.inputsBackground
    }
}

export const Radio = ({onChange, id, checked, name}) => {
    const theme = useContext(ThemeContext)
    return (
        <input name={name} style={getInputStyle(theme)} type="radio" id={id} onChange={onChange} checked={checked}/>
    );
};

Radio.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    checked: PropTypes.bool,
    name: PropTypes.string
};