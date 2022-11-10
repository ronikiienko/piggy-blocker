import React from 'react';
import {DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_STORAGE_KEY, WHAT_TO_DO_MAP} from '../../../common/consts';
import {Checkbox} from '../../StyledElements/Checkbox/Checkbox';
import {Radio} from '../../StyledElements/Radio/Radio';
import "./Options.css"


export const Options = () => {
    const [formData, setFormData] = React.useState(DEFAULT_SETTINGS);
    React.useEffect(() => {
        chrome.storage.sync.get({[SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS})
            .then(storage => {
                setFormData(storage[SETTINGS_STORAGE_KEY]);
            })
            .catch(e => console.log(e));
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
            <h1>Опції:</h1>
            <div className="where-to-block options-part">
                <h2>Де блокувати:</h2>
                <Checkbox id={SETTINGS_KEYS.blockOnHome} onChange={handleInputChange}
                          checked={formData[SETTINGS_KEYS.blockOnHome]}/>
                <label htmlFor={SETTINGS_KEYS.blockOnHome}>На головній сторінці</label>
                <br/>
                <Checkbox id={SETTINGS_KEYS.blockOnWatch} onChange={handleInputChange}
                          checked={formData[SETTINGS_KEYS.blockOnWatch]}/>
                <label htmlFor={SETTINGS_KEYS.blockOnWatch}>На сторінці перегляду відео збоку</label>
                <br/>
                <Checkbox id={SETTINGS_KEYS.blockOnShorts} onChange={handleInputChange}
                          checked={formData[SETTINGS_KEYS.blockOnShorts]}/>
                <label htmlFor={SETTINGS_KEYS.blockOnShorts}>На сторінці коротких відео</label>
                <br/>
            </div>
            <div className="how-to-block options-part">
                <h2>Як блокувати:</h2>
                <Radio id={WHAT_TO_DO_MAP.blur} name={SETTINGS_KEYS.whatToDo} onChange={handleInputChange}
                       checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blur}/>
                <label htmlFor={WHAT_TO_DO_MAP.blur}>Тільки блюрити</label>
                <br/>
                <Radio id={WHAT_TO_DO_MAP.notInterested} name={SETTINGS_KEYS.whatToDo} onChange={handleInputChange}
                       checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.notInterested}/>
                <label htmlFor={WHAT_TO_DO_MAP.notInterested}>Натискати "Не цікавить"</label>
                <br/>
                <Radio id={WHAT_TO_DO_MAP.blockChannel} name={SETTINGS_KEYS.whatToDo} onChange={handleInputChange}
                       checked={formData[SETTINGS_KEYS.whatToDo] === WHAT_TO_DO_MAP.blockChannel}/>
                <label htmlFor={WHAT_TO_DO_MAP.blockChannel}>Натискати "Не рекомендувати канал"</label>
                <br/>
            </div>
        </div>
    );
};