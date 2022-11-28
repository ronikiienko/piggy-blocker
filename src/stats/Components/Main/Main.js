import React from 'react';
import {useTheme} from '../../../commonBackground/hooks/useTheme';
import {Total} from '../Total/Total';
import './Main.css';


export const Main = () => {
    const [] = useTheme();

    return (
        <div className="main-container">
            <Total/>
        </div>
    );
};