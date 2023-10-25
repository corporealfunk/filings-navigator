import React from 'react';
import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div className="row">
      <div className="twelve columns">
        <h1 className="text-center">404 Not Found :(...</h1>
        <h5 className="text-center">
          <Link to="/">go home</Link>
        </h5>
      </div>
    </div>
  );
}
