import React from 'react';
import {DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY} from '../../common/consts';
import {getSettings} from '../../common/getSettings';


export const useSettings = () => {
    const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);

    React.useEffect(() => {
        getSettings()
            .then(storedSettings => {
                setSettings(storedSettings);
            })
            .catch(console.log);

        const handleChange = (changes) => {
            const changedSettings = changes[SETTINGS_STORAGE_KEY];
            if (!changedSettings) return;
            setSettings(changedSettings.newValue);
        };
        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    const updateSettings = React.useCallback((updatedValue) => {
        getSettings()
            .then(oldSettings => {
                let newSettings = {};
                if (typeof updatedValue === 'function') {
                    newSettings = updatedValue(oldSettings);
                } else {
                    newSettings = {
                        ...oldSettings,
                        ...updatedValue,
                    };
                }
                return chrome.storage.sync.set({[SETTINGS_STORAGE_KEY]: newSettings});
            })
            .catch(console.log);
    }, []);

    return [settings, updateSettings];
};