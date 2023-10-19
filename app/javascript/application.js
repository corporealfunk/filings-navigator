import React from 'react';
import ReactDOM from 'react-dom';

import SideBar from './components/SideBar.js';
import Filings from './components/Filings.js';

function App() {
  return (
    <div class="container">
      <div class="row">
        <div class="three columns">
          <SideBar/>
        </div>
        <div class="nine columns">
          <Filings/>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
