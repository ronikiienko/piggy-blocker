import React from 'react';
import {DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_STORAGE_KEY} from '../../../common/consts';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {Options} from '../Options/Options';
import {Stats} from '../Stats/Stats';
import './Main.css';


export const Main = () => {
    const [theme, setTheme] = React.useState('light');
    React.useEffect(() => {
        chrome.storage.sync.get({[SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS})
            .then(storage => {
                setTheme(storage[SETTINGS_STORAGE_KEY][SETTINGS_KEYS.theme]);
            })
            .catch(e => console.log(e))
    }, [])

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const userTheme = prevTheme === 'dark' ? 'light' : 'dark';
            chrome.storage.sync.get({[SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS})
                .then(storage => {
                    const newSettings = {...storage[SETTINGS_STORAGE_KEY], theme: userTheme}
                    return chrome.storage.sync.set({[SETTINGS_STORAGE_KEY]: newSettings})
                })
                .catch(e => console.log(e));
            return userTheme;
        });
    };
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
