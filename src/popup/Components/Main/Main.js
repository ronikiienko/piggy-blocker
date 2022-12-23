import React from 'react';
import {useTheme} from '../../../commonBackground/hooks/useTheme';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {Options} from '../Options/Options';
import {Stats} from '../Stats/Stats';
import './Main.css';


export const Main = () => {
    const [, toggleTheme] = useTheme();

    return (
        <div className="main-container">
            <div className="sub-main-container options-container">
                <Options/>
                <Button style={{width: '100%', margin: 'auto', marginTop: '10px'}} onClick={toggleTheme}>
                    {chrome.i18n.getMessage('theme_change_button_text')}
                </Button>
            </div>
            <div className="sub-main-container options-container">
                <Stats/>
            </div>
        </div>
    );
};
