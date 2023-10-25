import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Filings from './components/Filings.js';
import Filing from './components/Filing.js';
import Filers from './components/Filers.js';
import Layout from './components/Layout.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> } >
          <Route index element={ <Filings /> }/>
          <Route path="filings/:id" element={<Filing />} />
          <Route path="filers" element={<Filers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
