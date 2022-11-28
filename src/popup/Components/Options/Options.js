import React from 'react';
import {
    BLUR_INTENSITY_MAP,
    DEFAULT_SETTINGS,
    SETTINGS_KEYS,
    SETTINGS_STORAGE_KEY,
    WHAT_TO_DO_MAP,
} from '../../../common/consts';
import {getSettings} from '../../../common/getSettings';
import {Checkbox} from '../../../commonBackground/StyledElements/Checkbox/Checkbox';
import {Radio} from '../../../commonBackground/StyledElements/Radio/Radio';
import './Options.css';


export const Options = () => {
    const [formData, setFormData] = React.useState(DEFAULT_SETTINGS);
    React.useEffect(() => {
        getSettings()
            .then(setFormData)
            .catch(console.log)
    }, []);

    const handleInputChange = (event) => {
        setFormData((prevFormData) => {
            let newFormData;
            if (event.target.type === 'radio') {
                newFormData = {
                    ...prevFormData,
                    [event.target.name]: event.target.id,
                };
            } else {
                newFormData = {
                    ...prevFormData,
                    [event.target.id]: event.target.checked,
                };
            }
            chrome.storage.sync.set({[SETTINGS_STORAGE_KEY]: newFormData})
                .catch(e => console.log(e));
            return newFormData;
        });
    };

    return (
        <div>
            <h1>Налаштування:</h1>
            <div className="where-to-block options-part">
                <h2>Де блокувати:</h2>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnHome}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnHome]}
                    label="На головній сторінці"
                />
                <br/>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnWatch}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnWatch]}
                    label="На сторінці перегляду відео збоку"
                />
                <br/>
                <Checkbox
                    id={SETTINGS_KEYS.blockOnShorts}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blockOnShorts]}
                    label="На сторінці коротких відео"
                />
                <br/>
            </div>
            <div className="how-to-block options-part">
                <h2>Як блокувати:</h2>
                <Radio
                    id={WHAT_TO_DO_MAP.blur}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blur}
                    label={"Тільки блюрити"}
                />
                <br/>
                <Radio
                    id={WHAT_TO_DO_MAP.notInterested}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.notInterested}
                    label={"Натискати \"Не цікавить\""}
                />
                <br/>
                <Radio
                    id={WHAT_TO_DO_MAP.blockChannel}
                    name={SETTINGS_KEYS.whatToDo}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blockChannel}
                    label={"Натискати \"Не рекомендувати канал\""}
                />
                <br/>
            </div>
            <div className="how-to-blur options-part">
                <h2>Як блюрити:</h2>
                <Radio
                    id={BLUR_INTENSITY_MAP.weak}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.weak}
                    label={"Слабко"}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.normal}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.normal}
                    label={"Середньо"}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.strong}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.strong}
                    label={"Максимально"}
                />
                <br/>
                <Radio
                    id={BLUR_INTENSITY_MAP.transparent}
                    name={SETTINGS_KEYS.blurIntensity}
                    onChange={handleInputChange}
                    checked={formData[SETTINGS_KEYS.blurIntensity] === BLUR_INTENSITY_MAP.transparent}
                    label={"Прозорість"}
                    // disabled={true}
                />
            </div>
        </div>
    );
};