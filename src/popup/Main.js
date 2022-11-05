import React, {useState} from 'react';
import {checkIsVideoDataRu} from '../utils/containsRussian';


export const Main = () => {
    const [formState, setFormState] = useState({title: '', description: ''})
    const [isRussian, setIsRussian] = useState(false)
    const handleChange = (event) => {
        setFormState(prevFormState => {
            return {
                ...prevFormState,
                [event.target.id]: event.target.value
            }
        })
    }
    const detectLanguage = async () => {
        const result = await checkIsVideoDataRu({title: formState.title, description: formState.description})
        console.log('RESULT', result);
        setIsRussian(result)
    }
    return (
        <React.Fragment>
            <div>
                <input id="title" placeholder="title" value={formState.title} onInput={handleChange}/>
                <input id="description" placeholder="description"  onInput={handleChange} value={formState.description}/>
            </div>
            <p>Language: {isRussian ? 'russian' : 'no russian'}</p>
            <button onClick={detectLanguage}>Detect language</button>
        </React.Fragment>
    );
};
