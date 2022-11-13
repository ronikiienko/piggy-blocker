import React from 'react';
import ReactDom from 'react-dom/client';
import {Main} from './Components/Main/Main';


const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<Main />)
// ReactDom.render(<Main />, document.getElementById('root'))
