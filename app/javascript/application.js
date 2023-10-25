import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Filings from './components/Filings.js';
import Filing from './components/Filing.js';
import Filers from './components/Filers.js';
import Filer from './components/Filer.js';
import Layout from './components/Layout.js';
import NoMatch from './components/NoMatch.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> } >
          <Route index element={ <Filings /> }/>
          <Route path="filings/:id" element={<Filing />} />
          <Route path="filers/:id" element={<Filer />} />
          <Route path="filers" element={<Filers />} />
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
