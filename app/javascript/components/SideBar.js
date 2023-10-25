import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar() {
  return (
    <nav>
      Menu:
      <ul>
        <li><Link to='/'>Filings</Link></li>
        <li><Link to='/filers'>Filers</Link></li>
      </ul>
    </nav>
  );
}
