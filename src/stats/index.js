import React from 'react';
import ReactDom from 'react-dom/client';
import '../commonBackground/theme.css';
import {Main} from './Components/Main/Main';
import './index.css';


const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<Main/>);
