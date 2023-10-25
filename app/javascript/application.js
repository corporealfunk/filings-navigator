import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Filings from './components/Filings.js';
import Filing from './components/Filing.js';
import Filers from './components/Filers.js';
import Filer from './components/Filer.js';
import Recipients from './components/Recipients.js';
import Recipient from './components/Recipient.js';
import Layout from './components/Layout.js';
import NoMatch from './components/NoMatch.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> } >
          <Route index element={ <Filings /> }/>
          <Route path="filings/:id" element={<Filing />} />
          <Route path="filers" element={<Filers />} />
          <Route path="filers/:id" element={<Filer />} />
          <Route path="recipients" element={<Recipients />} />
          <Route path="recipients/:id" element={<Recipient />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
