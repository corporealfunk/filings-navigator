import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar.js';

export default function Layout() {
  return (
    <div class="container">
      <div class="row">
        <div class="three columns">
          <SideBar />
        </div>
        <div class="nine columns">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
