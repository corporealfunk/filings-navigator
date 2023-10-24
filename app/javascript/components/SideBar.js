import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar() {
  return (
    <ul>
      <li><Link to='/'>Filings</Link></li>
    </ul>
  );
}
