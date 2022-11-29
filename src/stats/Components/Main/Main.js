import React from 'react';
import {useTheme} from '../../../commonBackground/hooks/useTheme';
import './Main.css';
import {ForTimePeriod} from '../ForTimePeriod/ForTimePeriod';


export const Main = () => {
    const [] = useTheme();

    return (
        <div className="main-container">
            <ForTimePeriod />
        </div>
    );
};