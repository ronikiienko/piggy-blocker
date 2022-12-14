import React from 'react';
import {DEFAULT_SETTINGS, SETTINGS_KEYS} from '../../common/consts';
// import {getSettings} from '../../common/getSettings';
import {useSettings} from './useSettings';


export const useTheme = () => {
    const [settings, updateSettings] = useSettings();
    const [theme, setTheme] = React.useState(DEFAULT_SETTINGS.theme);

    React.useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    React.useEffect(() => {
        setTheme(settings.theme);
    }, [settings.theme]);

    const toggleTheme = React.useCallback(() => {
        updateSettings((prevSettings) => {
            // console.log(prevSettings)
            const userTheme = prevSettings[SETTINGS_KEYS.theme] === 'dark' ? 'light' : 'dark';
            return {...prevSettings, [SETTINGS_KEYS.theme]: userTheme};
        });
    }, [updateSettings]);

    return [theme, toggleTheme];
};