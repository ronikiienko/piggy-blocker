import React, {useEffect, useState} from 'react';
import {SETTINGS_KEYS, SETTINGS_STORAGE_KEY, WHAT_TO_DO_MAP} from '../common/consts';
import {Checkbox} from './StyledElements/Checkbox/Checkbox';
import {Radio} from './StyledElements/Radio';


const h2Styles = {
    marginBlock: 5
}

export const Options = () => {
    const [formData, setFormData] = useState({
        blockOnHome: true,
        blockOnWatch: true,
        blockOnShorts: true,
        whatToDo: 'blur',
    });

    const handleInputChange = (event) => {
        setFormData((prevFormData) => {
            if (event.target.type === 'radio') {
                return {
                    ...prevFormData,
                    [event.target.name]: event.target.id,
                };
            }
            return {
                ...prevFormData,
                [event.target.id]: event.target.checked,
            };
        });
    };
    useEffect(() => {
        chrome.storage.sync.get([SETTINGS_STORAGE_KEY])
            .then(storage => {
                setFormData(storage[SETTINGS_STORAGE_KEY])
            })
            .catch(e => console.log(e))
    }, [])
    useEffect(() => {
        chrome.storage.sync.set({[SETTINGS_STORAGE_KEY]: formData})
            .catch(e => console.log(e))
    }, [formData]);
    return (
        <div>
            <h1 style={{margin: 0}}>Опції:</h1>
            <h2 style={h2Styles}>Де блокувати:</h2>
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
            <h2 style={h2Styles}>Що робити з російськими відео:</h2>
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
    );
};