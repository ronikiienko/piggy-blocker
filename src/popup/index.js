import React from 'react';
import ReactDom from 'react-dom/client';
import '../commonBackground/theme.css';
import {Main} from './Components/Main/Main';
import './popup.css';


const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<Main/>);
// ReactDom.render(<Main />, document.getElementById('root'))
