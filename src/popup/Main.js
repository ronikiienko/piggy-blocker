import React, {useState} from 'react';
import {COLORS_DARK, COLORS_LIGHT} from '../common/consts';
import {Options} from './Options';
import {Stats} from './Stats';


const buttonStyle = {
    '&::after': {
        content: `''`,
        position: 'absolute',
        left: '-50px',
        top: '50px',
        width: '0',
        height: '0',
        border: '50px solid transparent',
        borderTopColor: 'red',
    }
}
const getContainerStyle = (theme) => {
    return {
        padding: 10,
        height: 500,
        width: 700,
        backgroundColor: theme.background,
        color: theme.mainText
    }
};
export const ThemeContext = React.createContext('light')
export const Main = () => {
    const [theme, setTheme] = useState('light')
    const mainCont = React.useRef(null);
    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'dark') return 'light';
            return 'dark'
        })
    }

    return (
        <ThemeContext.Provider value={theme}>
            <div data-theme={theme} style={getContainerStyle(theme)} ref={mainCont}>
                <button onClick={toggleTheme}>toggle theme</button>
                <Options />
                <Stats />
            </div>
        </ThemeContext.Provider>
    );
};
