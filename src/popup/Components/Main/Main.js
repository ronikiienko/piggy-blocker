import React from 'react';
import {useTheme} from '../../../commonBackground/hooks/useTheme';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {Options} from '../Options/Options';
import {Stats} from '../Stats/Stats';
import './Main.css';


export const Main = () => {
    const [theme, toggleTheme] = useTheme();

    return (
        <div data-theme={theme} className="main-container">
            <div className="sub-main-container options-container">
                <Options />
                <Button style={{width: '100%', margin: 'auto', marginTop: '10px'}} onClick={toggleTheme}>Темна/Світла тема</Button>
            </div>
            <div className="sub-main-container options-container">
                <Stats/>
            </div>
        </div>
    );
};
