import React from 'react';
import {SETTINGS_KEYS} from '../../../common/consts';
import {getSettings} from '../../../common/getSettings';
import './Main.css';
import {useTheme} from '../../../commonBackground/hooks/useTheme';


export const Main = () => {
    const [theme] = useTheme();
    return (
        <div data-theme={theme} className="main-container">
            <h1>Hello</h1>
            {/*<p>{theme}</p>*/}
        </div>
    );
};