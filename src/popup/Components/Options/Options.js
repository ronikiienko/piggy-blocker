import React from 'react';
import {BLUR_INTENSITY_MAP, SETTINGS_KEYS, WHAT_TO_DO_MAP} from '../../../common/consts';
import {useSettings} from '../../../commonBackground/hooks/useSettings';
import {Checkbox} from '../../../commonBackground/StyledElements/Checkbox/Checkbox';
import {Radio} from '../../../commonBackground/StyledElements/Radio/Radio';
import './Options.css';


export const Options = () => {
    // const [formData, setFormData] = React.useState(DEFAULT_SETTINGS);
    const [formData, updateSettings] = useSettings();
    // React.useEffect(() => {
    //     getSettings()
    //         .then(setFormData)
    //         .catch(console.log)
    // }, []);

    const handleInputChange = (event) => {
        let newKeyName = event.target.type === 'radio' ? event.target.name : event.target.id;
        let newValue = event.target.type === 'radio' ?event.target.id : event.target.checked;
        updateSettings({[newKeyName]: newValue});
    };

    return (
        <div>
            <h1>{chrome.i18n.getMessage('options_header')}</h1>
            <div className="where-to-block options-part">
                <h2>{chrome.i18n.getMessage('where_to_block_settings_header')}</h2>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnHome}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnHome]}
                    label={chrome.i18n.getMessage('where_to_block_home_option')}
                />
                <br/>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnWatch}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnWatch]}
                    label={chrome.i18n.getMessage('where_to_block_watch_option')}
                />
                <br/>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnShorts}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnShorts]}
                    label={chrome.i18n.getMessage('where_to_block_shorts_option')}
                />
                <br/>
            </div>
            <div className="how-to-block options-part">
                <h2>{chrome.i18n.getMessage('how_to_block_settings_header')}</h2>
                <Radio
                    id={WHAT_TO_DO_MAP.blur}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blur}
                    label={chrome.i18n.getMessage('how_to_block_blur_option')}
                />
                <br/>
                <Radio
                    id={WHAT_TO_DO_MAP.notInterested}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.notInterested}
                    label={chrome.i18n.getMessage('how_to_block_not_interested_option')}
                />
                <br/>
                <Radio
                    id={WHAT_TO_DO_MAP.blockChannel}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blockChannel}
                    label={chrome.i18n.getMessage('how_to_block_dont_recommend_channel_option')}
                />
                <br/>
            </div>
            <div className="how-to-blur options-part">
                <h2>{chrome.i18n.getMessage('how_to_blur_settings_header')}</h2>
                <Radio
                    id={BLUR_INTENSITY_MAP.weak}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.weak}
                    label={chrome.i18n.getMessage('how_to_blur_weak_option')}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.normal}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.normal}
                    label={chrome.i18n.getMessage('how_to_blur_normal_option')}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.strong}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.strong}
                    label={chrome.i18n.getMessage('how_to_blur_strong_option')}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.transparent}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.transparent}
                    label={chrome.i18n.getMessage('how_to_blur_transparent_option')}
                />
            </div>
        </div>
    );
};