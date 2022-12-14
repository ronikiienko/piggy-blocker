import React from 'react';
import {useTheme} from '../../../commonBackground/hooks/useTheme';
import {FilteredStats} from '../FilteredStats/FilteredStats';
import './Main.css';


export const Main = () => {
    useTheme();

    return (
        <div className="main-container">
            {/*<OverallStats />*/}
            <FilteredStats />
        </div>
    );
};