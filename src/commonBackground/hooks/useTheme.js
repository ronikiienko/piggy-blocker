import React from 'react';
import {DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_STORAGE_KEY} from '../../common/consts';
import {getSettings} from '../../common/getSettings';


export const useTheme = () => {
    // TODO set data-theme on html instead of body
    // TODO use browser theme as default
    const [theme, setTheme] = React.useState('light');

    React.useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    React.useEffect(() => {
        getSettings()
            .then(settings => {
                setTheme(settings[SETTINGS_KEYS.theme]);
            })
            .catch(console.log);

        chrome.storage.onChanged.addListener((changes, areaName) => {
            const settings = changes[SETTINGS_STORAGE_KEY];
            if (!settings) return;
            if (settings.newValue[SETTINGS_KEYS.theme] !== settings.oldValue[SETTINGS_KEYS.theme]) {
                setTheme(settings.newValue[SETTINGS_KEYS.theme]);
            }
        });
    }, []);

    const toggleTheme = React.useCallback(() => {
        chrome.storage.sync.get({[SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS})
            .then(storage => {
                const userTheme = storage[SETTINGS_STORAGE_KEY][SETTINGS_KEYS.theme] === 'dark' ? 'light' : 'dark';
                const newSettings = {...storage[SETTINGS_STORAGE_KEY], [SETTINGS_KEYS.theme]: userTheme};
                return chrome.storage.sync.set({[SETTINGS_STORAGE_KEY]: newSettings})
                    .then(() => setTheme(userTheme));
            })
            .catch(console.log);
    }, []);

    return [theme, toggleTheme];
};