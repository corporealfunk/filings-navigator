import React, { useEffect, useState } from 'react';

export default function Paginator({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
  limit,
  onLimitChange
}) {
  // TODO: the input box to select per page/limit isn't a great user experience,
  // it reloads on every input/change
  const limitOpts = [];
  for (let i=1; i <= 100; i++) {
    limitOpts.push(<option value={i}>{i}</option>);
  }

  return (
    <div className='row'>
      <div className='twelve columns text-center'>
        <p>
          { currentPage > 1 && (<a onClick={ onFirstPage }>&lt;&lt;</a>) }
          &nbsp;
          { currentPage > 1 && (<a onClick={ onPrevPage }>&lt;</a>) }
          &nbsp;
          Page { currentPage } of { totalPages }
          &nbsp;
          { currentPage < totalPages && (<a onClick={ onNextPage }>&gt;</a>) }
          &nbsp;
          { currentPage < totalPages && (<a onClick={ onLastPage }>&gt;&gt;</a>) }
          <div className="limit">
            <select
              value={limit}
              onChange={onLimitChange}
            >
              { limitOpts.map((option) => option) }
            </select>
            per page
          </div>
        </p>
      </div>
    </div>
  );
}
